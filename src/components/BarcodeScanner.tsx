import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme';
import { haptics } from '../utils/haptics';

interface BarcodeScannerProps {
  visible: boolean;
  onClose: () => void;
  onScan: (data: string, type: string) => void;
}

const { width, height } = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.7;

export function BarcodeScanner({ visible, onClose, onScan }: BarcodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    if (visible) {
      setScanned(false);
    }
  }, [visible]);

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (scanned) return;

    setScanned(true);
    haptics.success();
    onScan(result.data, result.type);
  };

  const handleClose = () => {
    haptics.light();
    onClose();
  };

  const toggleFlash = () => {
    haptics.light();
    setFlashOn(!flashOn);
  };

  if (!visible) return null;

  // Permission not determined yet
  if (!permission) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Initializing camera...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.container}>
          <View style={styles.permissionContainer}>
            <View style={styles.permissionIcon}>
              <Ionicons name="camera-outline" size={64} color={colors.textMuted} />
            </View>
            <Text style={styles.permissionTitle}>Camera Access Required</Text>
            <Text style={styles.permissionText}>
              To scan barcodes, we need access to your camera. This is only used for scanning and nothing is stored.
            </Text>
            <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
              <Text style={styles.permissionBtnText}>Grant Permission</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          enableTorch={flashOn}
          barcodeScannerSettings={{
            barcodeTypes: [
              'ean13',
              'ean8',
              'upc_a',
              'upc_e',
              'code128',
              'code39',
              'code93',
              'qr',
            ],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />

        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Top section */}
          <View style={styles.overlayTop}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.headerBtn} onPress={handleClose}>
                <Ionicons name="close" size={28} color={colors.textInverse} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Scan Barcode</Text>
              <TouchableOpacity style={styles.headerBtn} onPress={toggleFlash}>
                <Ionicons
                  name={flashOn ? 'flash' : 'flash-outline'}
                  size={24}
                  color={colors.textInverse}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Middle section with scan area */}
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.scanArea}>
              {/* Corner markers */}
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
            </View>
            <View style={styles.overlaySide} />
          </View>

          {/* Bottom section */}
          <View style={styles.overlayBottom}>
            <Text style={styles.instructionText}>
              {scanned
                ? 'Barcode detected!'
                : 'Position the barcode within the frame'}
            </Text>
            {scanned && (
              <TouchableOpacity
                style={styles.scanAgainBtn}
                onPress={() => setScanned(false)}
              >
                <Ionicons name="refresh" size={20} color={colors.textInverse} />
                <Text style={styles.scanAgainText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.textInverse,
    fontSize: 16,
    marginTop: spacing.lg,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    backgroundColor: colors.background,
  },
  permissionIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  permissionBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  permissionBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textInverse,
  },
  cancelBtn: {
    paddingVertical: spacing.md,
  },
  cancelBtnText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: spacing.xl,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textInverse,
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: SCAN_AREA_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.primary,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  instructionText: {
    fontSize: 16,
    color: colors.textInverse,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  scanAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  },
  scanAgainText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textInverse,
  },
});
