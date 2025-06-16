import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  findNodeHandle,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const Dropdown = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const anchorRef = useRef(null);

  const openMenu = () => {
    if (anchorRef.current) {
      const handle = findNodeHandle(anchorRef.current);
      if (handle) {
        UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
          setPosition({ top: pageY + height + 33, left: pageX - 130 }); // Adjust `left` as needed
          setVisible(true);
        });
      }
    }
  };

  const closeMenu = () => {
    setVisible(false);
  };

  const menuItems = [
    { icon: 'document-text-outline', label: 'Statement' },
    { icon: 'swap-horizontal-outline', label: 'Converter' },
    { icon: 'image-outline', label: 'Background' },
    { icon: 'person-add-outline', label: 'Add new account' },
  ];

  return (
    <View>
      <TouchableOpacity ref={anchorRef} onPress={openMenu} style={styles.moreBtn}>
        <Ionicons name="ellipsis-horizontal" size={24} color="black" />
        
      </TouchableOpacity>
<Text style={styles.moreText}>More</Text>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={closeMenu}>
        <TouchableOpacity style={styles.overlay} onPress={closeMenu}>
          <View style={[styles.dropdown, { top: position.top, left: position.left }]}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.dropdownItem}>
                <Ionicons name={item.icon} size={20} color="#000" style={styles.icon} />
                <Text style={styles.text}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  moreBtn: {
    width:60,
        height:60,
        borderRadius:40,
        backgroundColor: Colors.lightGray,
        justifyContent:'center',
        alignItems:'center',
        
   
   
  },
  moreText: {
    textAlign: 'center',
    margin:12,
    fontSize: 16,
    fontWeight:'500',
  },
  overlay: {
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    width: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingTop:20,
    borderBottomWidth: 0.2,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Dropdown;
