import { Injectable, Inject, forwardRef, HttpException } from '@nestjs/common';
import * as crypto from 'crypto';
import { Model, Types } from 'mongoose';
import { UserDto } from 'src/modules/user/dtos';
import { PerformerDto } from 'src/modules/performer/dtos';
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { SettingService } from 'src/modules/settings';
import { StringHelper, EntityNotFoundException, getConfig } from 'src/kernel';
import { MailerService } from 'src/modules/mailer';
import { STATUS_ACTIVE, GENDER_MALE } from 'src/modules/user/constants';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import { randomString } from 'src/kernel/helpers/string.helper';
import * as moment from 'moment';
import { AuthErrorException } from '../exceptions';
import {
  AUTH_MODEL_PROVIDER,
  FORGOT_MODEL_PROVIDER,
  VERIFICATION_MODEL_PROVIDER,
  OAUTH_LOGIN_MODEL_PROVIDER,
  AUTH_SESSION_MODEL_PROVIDER
} from '../providers/auth.provider';
import {
  AuthModel,
  ForgotModel,
  VerificationModel,
  OAuthLoginModel,
  AuthSessionModel
} from '../models';
import { AuthCreateDto } from '../dtos';
import { AuthGooglePayload } from '../payloads';
/* eslint-disable @typescript-eslint/no-var-requires */
const { OAuth2Client } = require('google-auth-library');
const oauth = require('oauth');
/* eslint-enable @typescript-eslint/no-var-requires */

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(OAUTH_LOGIN_MODEL_PROVIDER)
    private readonly oAuthLoginModel: Model<OAuthLoginModel>,
    @Inject(AUTH_MODEL_PROVIDER)
    private readonly authModel: Model<AuthModel>,
    @Inject(VERIFICATION_MODEL_PROVIDER)
    private readonly verificationModel: Model<VerificationModel>,
    @Inject(FORGOT_MODEL_PROVIDER)
    private readonly forgotModel: Model<ForgotModel>,
    @Inject(AUTH_SESSION_MODEL_PROVIDER)
    private readonly authSessionModel: Model<AuthSessionModel>,
    private readonly mailService: MailerService
  ) {}

  /**
   * generate password salt
   * @param byteSize integer
   */
  public generateSalt(byteSize = 16): string {
    return crypto.randomBytes(byteSize).toString('base64');
  }

  public encryptPassword(pw: string, salt: string): string {
    const defaultIterations = 10000;
    const defaultKeyLength = 64;

    return crypto
      .pbkdf2Sync(pw || '', salt, defaultIterations, defaultKeyLength, 'sha1')
      .toString('base64');
  }

  public async findOne(query: any) {
    const data = await this.authModel.findOne(query);
    return data;
  }

  public async find(query: any) {
    const data = await this.authModel.find(query);
    return data;
  }

  public async createAuthPassword(data: AuthCreateDto): Promise<AuthModel> {
    const salt = this.generateSalt();
    const newVal = this.encryptPassword(data.value, salt);

    console.log('auth.service.ts: createAuthPassword:', { data });
    // avoid admin update
    // TODO - should listen via user event?
    let auth = await this.authModel.findOne({
      type: 'password',
      sourceId: data.sourceId
    });

    console.log('auth.service.ts: createAuthPassword:', { auth });

    // custom added to update performerId when user creates a creator profile
    if (auth && data.source === 'performer') {
      console.log(
        'auth.service.ts: createAuthPassword: updating performerId',
        data.performerId
      );
      auth.performerId = data.performerId;
    } else {
      if (!auth) {
        // eslint-disable-next-line new-cap
        console.log(
          'auth.service.ts: createAuthPassword: creating new auth model'
        );
        auth = new this.authModel({
          type: 'password',
          source: data.source,
          sourceId: data.sourceId
        });
      }

      auth.salt = salt;
      auth.value = newVal;
      auth.key = data.key;
    }

    console.log('auth.service.ts: createAuthPassword: saving auth model', {
      auth
    });
    return auth.save();
  }

  public async updateAuthPerformerId(data: {
    sourceId: Types.ObjectId;
    performerId: Types.ObjectId;
  }) {
    console.log('auth.service.ts: updateAuthPerformerId:', { data });
    const auth = await this.authModel.findOne({
      type: 'password',
      sourceId: data.sourceId
    });

    if (!auth) {
      return {};
    }

    auth.performerId = data.performerId;
    console.log('auth.service.ts: updateAuthPerformerId: saving auth model', {
      auth
    });
    return auth.save();
  }

  public async updateAuthPassword(data: AuthCreateDto) {
    const user =
      data.source === 'user' ?
        await this.userService.findById(data.sourceId) :
        await this.performerService.findById(data.sourceId);
    if (!user) {
      throw new EntityNotFoundException();
    }
    await this.createAuthPassword({
      source: data.source,
      sourceId: data.sourceId,
      key: user.email || user?.username,
      value: data.value
    });
  }

  public async updateKey(data: AuthCreateDto) {
    const auths = await this.authModel.find({
      source: data.source,
      sourceId: data.sourceId
    });

    await Promise.all(
      auths.map((auth) => {
        // eslint-disable-next-line no-param-reassign
        auth.key = data.key;
        return auth.save();
      })
    );
  }

  public async findBySource(options: {
    source?: string;
    sourceId?: Types.ObjectId;
    type?: string;
    key?: string;
  }): Promise<AuthModel | null> {
    return this.authModel.findOne(options);
  }

  public verifyPassword(pw: string, auth: AuthModel): boolean {
    if (!pw || !auth || !auth.salt) {
      return false;
    }
    const encryptPassword = this.encryptPassword(pw, auth.salt);
    return encryptPassword === auth.value;
  }

  public async getSourceFromAuthSession(auth: {
    source: string;
    sourceId: Types.ObjectId;
  }): Promise<any> {
    if (auth.source === 'user') {
      const user = await this.userService.findById(auth.sourceId);
      return new UserDto(user).toResponse(true);
    }
    if (auth.source === 'performer') {
      const user = await this.performerService.findById(auth.sourceId);
      return new PerformerDto(user).toResponse(true);
    }

    return null;
  }

  public async getForgot(token: string): Promise<ForgotModel> {
    return this.forgotModel.findOne({ token });
  }

  public async removeForgot(id: string) {
    await this.forgotModel.deleteOne({ _id: id });
  }

  public async forgot(
    auth: AuthModel,
    source: {
      _id: Types.ObjectId;
      email: string;
    }
  ) {
    const token = StringHelper.randomString(14);
    await this.forgotModel.create({
      token,
      source: auth.source,
      sourceId: source._id,
      authId: auth._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const forgotLink = new URL(
      `auth/password-change?token=${token}`,
      getConfig('app').baseUrl
    ).href;
    await this.mailService.send({
      subject: 'Recover password',
      to: source.email,
      data: {
        forgotLink
      },
      template: 'forgot'
    });
    return true;
  }

  public async loginTwitter(callbackUrl = '') {
    const twitterClientId = SettingService.getValueByKey(
      SETTING_KEYS.TWITTER_LOGIN_CLIENT_ID
    );
    const twitterLoginClientSecret = SettingService.getValueByKey(
      SETTING_KEYS.TWITTER_LOGIN_CLIENT_SECRET
    );
    const _twitterConsumerKey =
      twitterClientId || process.env.TWITTER_LOGIN_CLIENT_ID;
    const _twitterConsumerSecret =
      twitterLoginClientSecret || process.env.TWITTER_LOGIN_CLIENT_SECRET;
    const _twitterCallbackUrl =
      callbackUrl ||
      process.env.SOCIAL_LOGIN_CALLBACK_URL ||
      process.env.USER_URL;
    const consumer = new oauth.OAuth(
      'https://twitter.com/oauth/request_token',
      'https://twitter.com/oauth/access_token',
      _twitterConsumerKey,
      _twitterConsumerSecret,
      '1.0A',
      _twitterCallbackUrl,
      'HMAC-SHA1'
    );
    return new Promise((resolver, reject) => {
      try {
        consumer.getOAuthRequestToken((error, oauthToken, oauthTokenSecret) => {
          if (error) {
            return reject(new AuthErrorException());
          }
          return resolver({
            url: `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`,
            oauthToken,
            oauthTokenSecret
          });
        });
      } catch (e) {
        reject(new AuthErrorException());
      }
    });
  }

  public async twitterLoginCallback(payload: Record<string, any>) {
    const {
      oauthToken,
      oauthTokenSecret,
      // eslint-disable-next-line camelcase
      oauth_verifier,
      role,
      callbackUrl = null
    } = payload;
    const twitterClientId = SettingService.getValueByKey(
      SETTING_KEYS.TWITTER_LOGIN_CLIENT_ID
    );
    const twitterLoginClientSecret = SettingService.getValueByKey(
      SETTING_KEYS.TWITTER_LOGIN_CLIENT_SECRET
    );
    const _twitterConsumerKey =
      twitterClientId || process.env.TWITTER_LOGIN_CLIENT_ID;
    const _twitterConsumerSecret =
      twitterLoginClientSecret || process.env.TWITTER_LOGIN_CLIENT_SECRET;
    const _twitterCallbackUrl =
      callbackUrl ||
      process.env.SOCIAL_LOGIN_CALLBACK_URL ||
      process.env.USER_URL;
    const consumer = new oauth.OAuth(
      'https://twitter.com/oauth/request_token',
      'https://twitter.com/oauth/access_token',
      _twitterConsumerKey,
      _twitterConsumerSecret,
      '1.0A',
      _twitterCallbackUrl,
      'HMAC-SHA1'
    );
    return new Promise((resolver, reject) => {
      try {
        consumer.getOAuthAccessToken(
          oauthToken,
          oauthTokenSecret,
          oauth_verifier,
          async (
            error,
            _oauthAccessToken,
            _oauthAccessTokenSecret,
            profile
          ) => {
            if (error) {
              return reject(
                new HttpException(
                  error?.message || 'Twitter Authentication Error',
                  403
                )
              );
            }
            if (!profile || !profile.user_id) {
              return reject(new EntityNotFoundException());
            }
            const oauthModel = await this.oAuthLoginModel.findOne({
              provider: 'twitter',
              'value.user_id': profile.user_id
            });
            if (oauthModel) {
              const authUser = await this.findBySource({
                source: role,
                sourceId: oauthModel.sourceId
              });
              if (!authUser) throw new AuthErrorException();
              const token = await this.updateAuthSession(
                role,
                oauthModel.sourceId
              );
              return { token };
            }
            const data = {
              username: profile.screen_name,
              name: profile.screen_name,
              status: STATUS_ACTIVE,
              gender: GENDER_MALE,
              twitterConnected: true,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            const newUser =
              role === 'performer' ?
                await this.performerService.socialCreate(data as any) :
                await this.userService.socialCreate(data as any);
            await this.createAuthPassword(
              new AuthCreateDto({
                source: role || 'user',
                sourceId: newUser._id,
                type: 'password',
                key: profile.screen_name
              })
            );
            await this.oAuthLoginModel.create({
              source: role || 'user',
              sourceId: newUser._id,
              provider: 'twitter',
              value: profile,
              createdAt: new Date(),
              updatedAt: new Date()
            });
            const token = await this.updateAuthSession(
              role || 'user',
              newUser._id
            );
            return resolver({ token });
          }
        );
      } catch (e) {
        reject(new EntityNotFoundException());
      }
    });
  }

  public async verifyLoginGoogle(payload: AuthGooglePayload) {
    const { tokenId, role } = payload;
    const googleLoginClientId = await SettingService.getValueByKey(
      SETTING_KEYS.GOOGLE_LOGIN_CLIENT_ID
    );
    const _googleLoginClientId =
      googleLoginClientId || process.env.GOOGLE_LOGIN_CLIENT_ID;
    const client = new OAuth2Client(_googleLoginClientId);
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: _googleLoginClientId
    });
    const profile = ticket.payload;
    if (!profile.email || !profile.email_verified) {
      throw new AuthErrorException();
    }
    const oauthModel = await this.oAuthLoginModel.findOne({
      provider: 'google',
      'value.email': profile.email
    });
    if (oauthModel) {
      const authUser = await this.findBySource({
        source: role,
        sourceId: oauthModel.sourceId
      });
      if (!authUser) throw new AuthErrorException();
      const token = await this.updateAuthSession(role, oauthModel.sourceId);
      return { token };
    }
    const randomUsername = `user${StringHelper.randomString(8, '0123456789')}`;
    const data = {
      email: profile.email.toLowerCase(),
      firstName: profile?.given_name || '',
      lastName: profile.family_name,
      username: randomUsername,
      name: profile.name,
      avatarPath: profile.picture || null,
      verifiedEmail: true,
      status: STATUS_ACTIVE,
      gender: GENDER_MALE,
      googleConnected: true
    };
    const newUser =
      role === 'user' ?
        await this.userService.socialCreate(data as any) :
        await this.performerService.socialCreate(data as any);
    let newAuth = (await this.authModel.findOne({
      type: 'password',
      sourceId: newUser._id
    })) as any;
    if (!newAuth) {
      newAuth = await this.createAuthPassword(
        new AuthCreateDto({
          source: role || 'user',
          sourceId: newUser._id,
          type: 'password',
          key: profile.email
        })
      );
    }
    const authData = await this.oAuthLoginModel.findOne({
      sourceId: newUser._id,
      provider: 'google',
      'value.email': profile.email
    });
    if (!authData) {
      await this.oAuthLoginModel.create({
        source: role || 'user',
        sourceId: newUser._id,
        provider: 'google',
        value: profile,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    const token = await this.updateAuthSession(role || 'user', newUser._id);
    return { token };
  }

  async sendVerificationEmail(source: any): Promise<void> {
    const verifications = await this.verificationModel.find({
      sourceId: source._id,
      value: source.email.toLowerCase()
    });
    const token = StringHelper.randomString(15);
    if (!verifications.length) {
      await this.verificationModel.create({
        sourceId: source._id,
        sourceType: 'user',
        value: source.email,
        token
      });
      await this.verificationModel.create({
        sourceId: source._id,
        sourceType: 'performer',
        value: source.email,
        token
      });
    }
    if (verifications.length) {
      const ids = verifications.map((v) => v._id);
      await this.verificationModel.updateMany(
        { _id: { $in: ids } },
        { $set: { token, updatedAt: new Date() } }
      );
    }
    const verificationLink = new URL(
      `auth/email-verification?token=${token}`,
      getConfig('app').baseUrl
    ).href;
    const siteName =
      SettingService.getValueByKey(SETTING_KEYS.SITE_NAME) ||
      process.env.DOMAIN;
    await this.mailService.send({
      to: source.email,
      subject: 'Verify your email address',
      data: {
        name: source?.name || source?.username || 'there',
        verificationLink,
        siteName
      },
      template: 'email-verification'
    });
  }

  async verifyEmail(token: string): Promise<void> {
    const verifications = await this.verificationModel.find({
      token
    });
    if (!verifications || !verifications.length) {
      throw new EntityNotFoundException();
    }
    await Promise.all(
      verifications.map(async (verification) => {
        // eslint-disable-next-line no-param-reassign
        verification.verified = true;
        // eslint-disable-next-line no-param-reassign
        verification.updatedAt = new Date();
        await verification.save();
        if (verification.sourceType === 'user') {
          await this.userService.updateVerificationStatus(
            verification.sourceId
          );
        }
        if (verification.sourceType === 'performer') {
          await this.performerService.updateVerificationStatus(
            verification.sourceId
          );
        }
      })
    );
  }

  public async updateAuthSession(
    source: string,
    sourceId: string | Types.ObjectId,
    expiresInSeconds = 60 * 60 * 24
  ) {
    const session = await this.authSessionModel.findOne({
      sourceId
    });
    const expiryAt = moment().add(expiresInSeconds, 'seconds').toDate();
    if (session) {
      await this.authSessionModel.updateOne(
        {
          _id: session._id
        },
        {
          $set: {
            expiryAt
          }
        }
      );
      return session.token;
    }

    const token = randomString(15);
    await this.authSessionModel.create({
      source,
      sourceId,
      token,
      expiryAt,
      createdAt: new Date()
    });

    return token;
  }

  public async verifySession(token: string) {
    const session = await this.authSessionModel.findOne({ token }).lean();
    if (!session || moment().isAfter(new Date(session.expiryAt))) {
      return false;
    }
    return session;
  }
}
