import React, { useEffect, useState } from "react";
import { stringify } from 'query-string';

import { makeStyles } from "@material-ui/core/styles";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import Paginator from 'react-hooks-paginator';

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

const useStyles = makeStyles(styles);

export default function SongList(props) {
  const classes = useStyles();

  const pageLimit = 3;
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [currentData, setCurrentData] = useState([]);

  const search = () => {
    const collectionId = props.location.search.split('=')[1];
    const query = {
      id: collectionId,
      entity: 'song'
    };      
    const  apiUrl = 'https://itunes.apple.com/lookup';
    const url = `${apiUrl}?${stringify(query)}`;

    fetch(
      url,
      {method: "GET"}
    )
    .then(res => res.json())
    .then(response => {
      const artists = response.results.map(
        s => [
          s.trackId,
          s.trackName,
          s.artistName
        ]
      )
      setData(artists);
    })
    .catch(error => console.log(error));
  }

  useEffect(() => {    
    search();
  }, []);

  useEffect(() => {
    setCurrentData(data.slice(offset, offset + pageLimit));
  }, [offset, data]);

  return (   
    <div>
      <div className={classes.searchWrapper}>
        <br></br>
      </div>
            
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Songs</h4>
              <p className={classes.cardCategoryWhite}>
                Songs per artist
            </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["ID", "Song", "Artist"]}
                tableData={currentData}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <Paginator
        totalRecords={data.length}
        pageLimit={pageLimit}
        pageNeighbours={2}
        setOffset={setOffset}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
