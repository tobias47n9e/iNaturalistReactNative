import { useRoute } from "@react-navigation/native";
import { render, screen } from "@testing-library/react-native";
import ObsDetailsProjects from "components/ObsDetails/ObsDetailsProjects.tsx";
import React from "react";
import factory from "tests/factory";

const mockProjects = [
  factory( "RemoteProject", {
    title: "project_1"
  } ),
  factory( "RemoteProject", {
    title: "project_2"
  } )
];

describe( "ObsDetailsProjects", () => {
  beforeAll( ( ) => {
    useRoute.mockImplementation( ( ) => ( {
      params: {
        projects: mockProjects
      }
    } ) );
  } );

  it( "should display a list with all project titles", async () => {
    render( <ObsDetailsProjects /> );
    const firstProjectTitle = await screen.findByText( mockProjects[0].title );
    expect( firstProjectTitle ).toBeVisible( );
    const secondProjectTitle = await screen.findByText( mockProjects[1].title );
    expect( secondProjectTitle ).toBeVisible( );
  } );
} );
