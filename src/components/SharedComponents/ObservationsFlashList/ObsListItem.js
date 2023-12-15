// @flow
import { DateDisplay, DisplayTaxonName, ObservationLocation } from "components/SharedComponents";
import { View } from "components/styledComponents";
import type { Node } from "react";
import React from "react";
import Photo from "realmModels/Photo";

import ObsImagePreview from "./ObsImagePreview";
import ObsStatus from "./ObsStatus";
import ObsUploadStatusContainer from "./ObsUploadStatusContainer";

type Props = {
  observation: Object,
  uploadSingleObservation?: Function,
  uploadState: Object,
  explore: boolean
};

const ObsListItem = ( {
  observation, uploadSingleObservation, uploadState, explore = false
}: Props ): Node => {
  const photo = observation?.observationPhotos?.[0]?.photo
    || observation?.observation_photos?.[0]?.photo
    || null;
  const needsSync = typeof observation.needsSync !== "undefined" && observation.needsSync( );

  return (
    <View
      testID={`MyObservations.obsListItem.${observation.uuid}`}
      className="flex-row px-[15px] my-[11px]"
    >
      <ObsImagePreview
        source={{ uri: Photo.displayLocalOrRemoteSquarePhoto( photo ) }}
        obsPhotosCount={observation?.observationPhotos?.length ?? 0}
        hasSound={!!observation?.observationSounds?.length}
        opaque={needsSync}
        isSmall
        iconicTaxonName={observation.taxon?.iconic_taxon_name}
      />
      <View className="pr-[25px] flex-1 ml-[10px]">
        <DisplayTaxonName
          taxon={observation?.taxon}
          scientificNameFirst={observation?.user?.prefers_scientific_name_first}
        />
        <ObservationLocation observation={observation} classNameMargin="mt-1" />
        <DateDisplay
          dateString={
            observation.time_observed_at || observation.observed_on_string
          }
          classNameMargin="mt-1"
        />
      </View>
      {explore
        ? (
          <ObsStatus
            observation={observation}
            layout="vertical"
            testID={`ObsStatus.${observation.uuid}`}
          />
        )
        : (
          <View className="items-center ml-auto justify-center">
            <ObsUploadStatusContainer
              observation={observation}
              layout="vertical"
              uploadSingleObservation={uploadSingleObservation}
              uploadState={uploadState}
            />
          </View>
        )}
    </View>
  );
};

export default ObsListItem;
