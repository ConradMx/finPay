import React from 'react';
import { Modal, View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

interface PaystackModalProps {
  visible: boolean;
  url: string;
  onClose: () => void;
}

const PaystackModal: React.FC<PaystackModalProps> = ({ visible, url, onClose }) => {
  if (!visible || !url) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1 }}>
        <WebView
          source={{ uri: url }}
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator
              size="large"
              color="#00A86B"
              style={{ marginTop: 50 }}
            />
          )}
          onNavigationStateChange={(navState) => {
            if (navState.url.includes('payment/success')) {
              onClose(); // You can add success logic here
            }
          }}
        />
      </View>
    </Modal>
  );
};

export default PaystackModal;
