// @flow

import { fetchObservationUpdates, fetchRemoteObservations } from "api/observations";
import { flatten } from "lodash";
import { RealmContext } from "providers/contexts.ts";
import { useCallback } from "react";
import Observation from "realmModels/Observation";
import { useAuthenticatedInfiniteQuery, useCurrentUser } from "sharedHooks";
import useStore from "stores/useStore";

const { useRealm } = RealmContext;

const BASE_PARAMS = {
  observations_by: "owner",
  fields: "all",
  per_page: 30,
  ttl: -1,
  page: 1
};

const useInfiniteNotificationsScroll = ( ): Object => {
  const currentUser = useCurrentUser( );
  const realm = useRealm( );
  const observationMarkedAsViewedAt = useStore( state => state.observationMarkedAsViewedAt );

  const queryKey = ["useInfiniteNotificationsScroll", observationMarkedAsViewedAt];

  const fetchObsByUUIDs = useCallback( async ( uuids, authOptions ) => {
    const observations = await fetchRemoteObservations(
      uuids,
      { fields: Observation.FIELDS },
      authOptions
    );
    Observation.upsertRemoteObservations( observations, realm );
  }, [realm] );

  const infQueryResult = useAuthenticatedInfiniteQuery(
    queryKey,
    async ( { pageParam }, optsWithAuth ) => {
      const params = { ...BASE_PARAMS };

      if ( pageParam ) {
        params.page = pageParam;
      } else {
        params.page = 1;
      }

      const response = await fetchObservationUpdates( params, optsWithAuth );
      // Sometimes updates linger after notifiers that generated them have been deleted
      const updatesWithContent = response?.filter(
        update => update.comment || update.identification
      ) || [];
      const obsUUIDs = updatesWithContent.map( obsUpdate => obsUpdate.resource_uuid );
      if ( obsUUIDs.length > 0 ) {
        await fetchObsByUUIDs( obsUUIDs, optsWithAuth );
      }

      return updatesWithContent;
    },
    {
      getNextPageParam: ( lastPage, allPages ) => ( lastPage.length > 0
        ? allPages.length + 1
        : undefined ),
      enabled: !!( currentUser )
    }
  );

  return {
    ...infQueryResult,
    // Disable fetchNextPage if signed out
    fetchNextPage: currentUser
      ? infQueryResult.fetchNextPage
      : ( ) => undefined,
    notifications: flatten( infQueryResult?.data?.pages )
  };
};

export default useInfiniteNotificationsScroll;
