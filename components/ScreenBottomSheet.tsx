import React, { useCallback, forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetBackdrop,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

interface ScreenBottomSheetProps {
    children: React.ReactNode;
    snapPoints?: string[];
    onDismiss?: () => void;
    /**
     * Set to true ONLY when the child content already renders its own
     * BottomSheetScrollView / FlatList / SectionList. In that case the children
     * are rendered as the direct child of the modal so the scrollable is
     * registered with the sheet.
     *
     * Leave it false (the default) and the sheet wraps the content in a
     * BottomSheetScrollView, so overflowing content is always reachable.
     */
    scrollable?: boolean;
}

export const ScreenBottomSheet = forwardRef<BottomSheetModal, ScreenBottomSheetProps>(
    ({ children, snapPoints = ['90%'], onDismiss, scrollable = false }, ref) => {
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
                // Resize the sheet instead of overlaying it, so a software
                // keyboard on a short screen does not permanently cover inputs.
                android_keyboardInputMode="adjustResize"
                onDismiss={onDismiss}
            >
                {scrollable ? (
                    children
                ) : (
                    <BottomSheetScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="interactive"
                        showsVerticalScrollIndicator
                    >
                        <BottomSheetView style={styles.contentContainer}>
                            {children}
                        </BottomSheetView>
                    </BottomSheetScrollView>
                )}
            </BottomSheetModal>
        );
    }
);

ScreenBottomSheet.displayName = 'ScreenBottomSheet';

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    // flexGrow (not a fixed height) keeps short content vertically centred via
    // the sheets' own justifyContent, while letting tall content grow so the
    // ScrollView has something to actually scroll.
    scrollContent: {
        flexGrow: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
});

export default ScreenBottomSheet;
