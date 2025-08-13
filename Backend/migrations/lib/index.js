const crypto = require('crypto');

const mongoose = require('mongoose');

exports.COLLECTION = {
    SETTING: 'settings',
    USER: 'users',
    AUTH: 'auth',
    POST: 'posts',
    MENU: 'menus',
    PERFORMER: 'performers',
    PERFORMER_VIDEO: 'performervideos',
    EMAIL_TEMPLATE: 'emailtemplates',
    PAYMENT: 'paymenttransactions',
    OAUTH_SOCIALS_LOGIN: 'oauthSocialslogin',
    USER_SUBSCRIPTIONS: 'usersubscriptions',
    MESSAGES: 'messages',
    CONVERSATIONS: 'conversations',
    MESSAGE_DETECTION_KEYWORDS: 'messagedetectionkeywords',
    SPECIAL_REQUEST_TYPE_CATEGORIES: 'specialrequesttypecategories',
    SPECIAL_REQUEST_TYPES: 'specialrequesttypes',
    TOXICITY_REPORTS: 'toxicityreports'
};

exports.DB = mongoose.connection;

exports.encryptPassword = (pw, salt) => {
    const defaultIterations = 10000;
    const defaultKeyLength = 64;

    return crypto
        .pbkdf2Sync(pw, salt, defaultIterations, defaultKeyLength, 'sha1')
        .toString('base64');
};

exports.generateSalt = (byteSize = 16) => crypto.randomBytes(byteSize).toString('base64');

// export const categoryTags = [
//   { label: 'Birthday greeting', icon: <GiftOutlined /> },
//   { label: 'Birthday appearence', icon: <FireOutlined /> },
//   { label: 'Record a video message', icon: <AudioOutlined /> },
//   { label: 'Attend an event', icon: <CalendarOutlined /> },
//   { label: 'Message for a specific person', icon: <CommentOutlined /> }
// ];

exports.SPECIAL_REQUEST_TYPE_CATEGORIES = [
    { name: 'Personal celebrations', code: 'PERSONAL_CELEBRATIONS', description: '' },
    { name: 'Email participation', code: 'EMAIL_PARTICIPATION', description: '' },
    { name: 'Promotions & media', code: 'PROMOTIONS_MEDIA', description: '' },
    { name: 'Engagements & interaction', code: 'ENGAGEMENTS_INTERACTION', description: '' },
    { name: 'Fundraising & other requirements', code: 'FUNDRAISING_OTHER', description: '' }
];

exports.SPECIAL_REQUEST_TYPES = [
    { name: 'Birthday greeting', category: 'PERSONAL_CELEBRATIONS', description: '' },
    { name: 'Birthday appearance', category: 'PERSONAL_CELEBRATIONS', description: '' },
    { name: 'Record a video message', category: 'PERSONAL_CELEBRATIONS', description: '' },
    { name: 'Attend an event', category: 'PERSONAL_CELEBRATIONS', description: '' },
    { name: 'Message for a specific person', category: 'PERSONAL_CELEBRATIONS', description: '' },

    { name: 'Deliver speech', category: 'EMAIL_PARTICIPATION', description: '' },
    { name: 'Motivational message', category: 'EMAIL_PARTICIPATION', description: '' },
    { name: 'Team announcement', category: 'EMAIL_PARTICIPATION', description: '' },
    { name: 'Guest speaking', category: 'EMAIL_PARTICIPATION', description: '' },
    { name: 'Panel appearances', category: 'EMAIL_PARTICIPATION', description: '' },
    { name: 'MC appearances', category: 'EMAIL_PARTICIPATION', description: '' },
    { name: 'Guest appearances', category: 'EMAIL_PARTICIPATION', description: '' },

    { name: 'Club or event promotion', category: 'PROMOTIONS_MEDIA', description: '' },
    { name: 'Event shoutout', category: 'PROMOTIONS_MEDIA', description: '' },
    { name: 'Product launch', category: 'PROMOTIONS_MEDIA', description: '' },
    { name: 'Social media post', category: 'PROMOTIONS_MEDIA', description: '' },
    { name: 'Be My Brand/Product Ambassador', category: 'PROMOTIONS_MEDIA', description: '' },

    { name: 'Video Q&A', category: 'ENGAGEMENTS_INTERACTION', description: '' },
    { name: 'Sign Autographs', category: 'ENGAGEMENTS_INTERACTION', description: '' },
    { name: 'Mingle & Socialize', category: 'ENGAGEMENTS_INTERACTION', description: '' },
    { name: 'Run a Skills Clinic', category: 'ENGAGEMENTS_INTERACTION', description: '' },
    { name: 'Private Coaching', category: 'ENGAGEMENTS_INTERACTION', description: '' },
    { name: 'Keynote', category: 'ENGAGEMENTS_INTERACTION', description: '' },
    { name: 'Q&A', category: 'ENGAGEMENTS_INTERACTION', description: '' },

    { name: 'Fundraising', category: 'FUNDRAISING_OTHER', description: '' },
    { name: 'Other', category: 'FUNDRAISING_OTHER', description: '' }
];
