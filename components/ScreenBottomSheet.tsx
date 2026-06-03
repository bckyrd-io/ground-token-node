import React, { useCallback, forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

interface ScreenBottomSheetProps {
    children: React.ReactNode;
    snapPoints?: string[];
    onDismiss?: () => void;
}

export const ScreenBottomSheet = forwardRef<BottomSheetModal, ScreenBottomSheetProps>(
    ({ children, snapPoints = ['90%'], onDismiss }, ref) => {
        const renderBackdrop = useCallback(
            (props: any) => (
                <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
            ),
            []
        );

        return (
            <BottomSheetModal
                ref={ref}
                snapPoints={snapPoints}
                enableDynamicSizing={false}
                enablePanDownToClose
                backdropComponent={renderBackdrop}
                keyboardBehavior="interactive"
                keyboardBlurBehavior="restore"
                onDismiss={onDismiss}
            >
                <BottomSheetView style={styles.contentContainer}>
                    {children}
                </BottomSheetView>
            </BottomSheetModal>
        );
    }
);

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
    },
});

export default ScreenBottomSheet;
