// @flow
import MyObservationsHeader from "components/MyObservations/MyObservationsHeader";
import ObservationsFlashList from "components/ObservationsFlashList/ObservationsFlashList";
import {
  ScrollableWithStickyHeader,
  ViewWrapper
} from "components/SharedComponents";
import type { Node } from "react";
import React from "react";

import Announcements from "./Announcements";
import LoginSheet from "./LoginSheet";

type Props = {
  currentUser: Object,
  handleIndividualUploadPress: Function,
  handleSyncButtonPress: Function,
  isConnected: boolean,
  isFetchingNextPage: boolean,
  layout: "list" | "grid",
  listRef?: Object,
  numUnuploadedObservations: number,
  observations: Array<Object>,
  onEndReached: Function,
  onListLayout?: Function,
  onScroll?: Function,
  setShowLoginSheet: Function,
  showLoginSheet: boolean,
  showNoResults: boolean,
  toggleLayout: Function
};

const MyObservations = ( {
  currentUser,
  handleIndividualUploadPress,
  handleSyncButtonPress,
  isConnected,
  isFetchingNextPage,
  layout,
  listRef,
  numUnuploadedObservations,
  observations,
  onEndReached,
  onListLayout,
  onScroll,
  setShowLoginSheet,
  showLoginSheet,
  showNoResults,
  toggleLayout
}: Props ): Node => (
  <>
    <ViewWrapper>
      <ScrollableWithStickyHeader
        onScroll={onScroll}
        renderHeader={setStickyAt => (
          <MyObservationsHeader
            currentUser={currentUser}
            handleSyncButtonPress={handleSyncButtonPress}
            hideToolbar={observations.length === 0}
            layout={layout}
            logInButtonNeutral={observations.length === 0}
            numUnuploadedObservations={numUnuploadedObservations}
            setHeightAboveToolbar={setStickyAt}
            toggleLayout={toggleLayout}
          />
        )}
        renderScrollable={animatedScrollEvent => (
          <ObservationsFlashList
            dataCanBeFetched={!!currentUser}
            data={observations.filter( o => o.isValid() )}
            handleIndividualUploadPress={handleIndividualUploadPress}
            onScroll={animatedScrollEvent}
            hideLoadingWheel={!isFetchingNextPage || !currentUser}
            isFetchingNextPage={isFetchingNextPage}
            isConnected={isConnected}
            layout={layout}
            onEndReached={onEndReached}
            onLayout={onListLayout}
            ref={listRef}
            showObservationsEmptyScreen
            showNoResults={showNoResults}
            testID="MyObservationsAnimatedList"
            renderHeader={(
              <Announcements isConnected={isConnected} />
            )}
          />
        )}
      />
    </ViewWrapper>
    {showLoginSheet && <LoginSheet setShowLoginSheet={setShowLoginSheet} />}
  </>
);

export default MyObservations;
