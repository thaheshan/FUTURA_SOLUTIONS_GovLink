import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigation/AppNavigator';

const { width } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const AIAssistantScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I assist you today with Sri Lankan government services?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  
  // Animation for typing indicator
  const typingAnimation = useRef(new Animated.Value(0)).current;

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping]);

  const generateAssistantResponse = (userMessage: string) => {
    const responses = {
      'driver': "To renew your driver's license, you'll need to visit the Department of Motor Traffic, submit your current license, a medical certificate, and pay the renewal fee. You can find more details on their website.",
      'birth': "For birth certificates, you'll need to visit the Registrar General's Department with required documents including hospital birth certificate, parents' IDs, and marriage certificate if applicable.",
      'marriage': "Marriage certificates can be obtained from the Registrar General's Department. You'll need to bring your NIC, birth certificates of both parties, and divorce decree if previously married.",
      'educational': "Educational certificates can be verified through the Department of Examinations. For university certificates, contact the respective university directly.",
      'appointment': "You can book appointments through our online portal or visit the relevant government office directly. Which service do you need an appointment for?",
      'track': "You can track your application status using your reference number on the respective department's website or through our tracking system.",
      'help': "I can help you with information about Sri Lankan government services including birth certificates, marriage certificates, educational certificates, driver's license renewals, and booking appointments. What specific service do you need help with?"
    };

    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return "I understand you're looking for information about government services. Could you please specify which service you need help with? I can assist with birth certificates, marriage certificates, educational certificates, driver's license, or appointments.";
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '' || isTyping) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    const currentInput = inputText.trim();
    setInputText('');
    setIsTyping(true);

    // Simulate assistant response delay
    setTimeout(() => {
      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAssistantResponse(currentInput),
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would handle voice recording
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
      }, 3000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  const handleQuickAction = (action: string) => {
    if (isTyping) return;
    setInputText(action);
    inputRef.current?.focus();
  };

  const TypingIndicator = () => (
    <View style={styles.typingContainer}>
      <View style={styles.assistantAvatar}>
        <Text style={styles.avatarEmoji}>🤖</Text>
      </View>
      <View style={styles.typingBubbleContainer}>
        <Text style={styles.assistantLabel}>AI Assistant</Text>
        <View style={styles.typingBubble}>
          <View style={styles.typingDotsContainer}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.typingDot,
                  {
                    opacity: typingAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    }),
                    transform: [
                      {
                        scale: typingAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1.2],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Icon name="arrow-back" size={24} color="#4B5563" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>AI Assistant</Text>
          </View>
        </View>

        {/* Messages Container */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
        >
          {messages.map((message) => (
            <View key={message.id} style={styles.messageWrapper}>
              {message.sender === 'assistant' ? (
                <View style={styles.assistantMessageContainer}>
                  <View style={styles.assistantAvatar}>
                    <Text style={styles.avatarEmoji}>🤖</Text>
                  </View>
                  <View style={styles.assistantMessageContent}>
                    <Text style={styles.assistantLabel}>AI Assistant</Text>
                    <View style={styles.assistantBubble}>
                      <Text style={styles.assistantMessageText}>{message.text}</Text>
                    </View>
                    <Text style={styles.messageTime}>
                      {formatTime(message.timestamp)}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.userMessageContainer}>
                  <View style={styles.userMessageContent}>
                    <View style={styles.userBubble}>
                      <Text style={styles.userMessageText}>{message.text}</Text>
                    </View>
                    <Text style={styles.messageTimeRight}>
                      {formatTime(message.timestamp)}
                    </Text>
                  </View>
                  <View style={styles.userAvatar}>
                    <Text style={styles.avatarEmoji}>👤</Text>
                  </View>
                </View>
              )}
            </View>
          ))}

          {/* Typing Indicator */}
          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputArea}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={inputRef}
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type your message..."
                placeholderTextColor="#9CA3AF"
                multiline
                maxLength={500}
                editable={!isTyping}
                onSubmitEditing={handleSendMessage}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={[
                  styles.micButton,
                  isRecording && styles.micButtonActive
                ]}
                onPress={toggleRecording}
                activeOpacity={0.7}
              >
                <Icon 
                  name={isRecording ? "mic-off" : "mic"} 
                  size={18} 
                  color={isRecording ? "#FFFFFF" : "#6B7280"} 
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                styles.sendButton,
                (inputText.trim() === '' || isTyping) && styles.sendButtonDisabled
              ]}
              onPress={handleSendMessage}
              disabled={inputText.trim() === '' || isTyping}
              activeOpacity={0.8}
            >
              <Icon name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Quick Action Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickActionsContainer}
            contentContainerStyle={styles.quickActionsContent}
          >
            {[
              "Help with driver's license",
              'Birth certificate info',
              'Book appointment',
              'Track my request'
            ].map((quickAction) => (
              <TouchableOpacity
                key={quickAction}
                style={[
                  styles.quickActionButton,
                  isTyping && styles.quickActionButtonDisabled
                ]}
                onPress={() => handleQuickAction(quickAction)}
                disabled={isTyping}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.quickActionText,
                  isTyping && styles.quickActionTextDisabled
                ]}>
                  {quickAction}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  assistantMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 16,
  },
  assistantMessageContent: {
    flex: 1,
    maxWidth: width * 0.75,
  },
  assistantLabel: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 4,
  },
  assistantBubble: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  assistantMessageText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  userMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  userMessageContent: {
    flex: 1,
    maxWidth: width * 0.75,
    alignItems: 'flex-end',
  },
  userBubble: {
    backgroundColor: '#475569',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userMessageText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  messageTime: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    marginLeft: 8,
  },
  messageTimeRight: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    marginRight: 8,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  typingBubbleContainer: {
    flex: 1,
    maxWidth: width * 0.75,
  },
  typingBubble: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  typingDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
    marginRight: 4,
  },
  inputArea: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    minHeight: 44,
    maxHeight: 120,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
    paddingVertical: 8,
    textAlignVertical: 'center',
  },
  micButton: {
    padding: 8,
    borderRadius: 16,
    marginLeft: 8,
  },
  micButtonActive: {
    backgroundColor: '#EF4444',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  quickActionsContainer: {
    maxHeight: 40,
  },
  quickActionsContent: {
    paddingRight: 16,
  },
  quickActionButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    height: 32,
    justifyContent: 'center',
  },
  quickActionButtonDisabled: {
    opacity: 0.5,
  },
  quickActionText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  quickActionTextDisabled: {
    color: '#9CA3AF',
  },
});

export default AIAssistantScreen;

