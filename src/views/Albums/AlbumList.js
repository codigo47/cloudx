import React, { useEffect, useState } from "react";
import { stringify } from 'query-string';

import { makeStyles } from "@material-ui/core/styles";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Search from "@material-ui/icons/Search";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

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

export default function AlbumList(props) {
  const classes = useStyles();

  const pageLimit = 3;
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [currentData, setCurrentData] = useState([]);

  const [input, setInput] = useState({
    search: ''
  });

  const search = () => {    
    let url;
    const artistId = props.location.search.split('=')[1];

    // if there is and ID and search is '', use lookup resource
    if (artistId !== undefined && input.search === '') {
      let query = {
        id: artistId,
        entity: 'album'
      };      
      let apiUrl = 'https://itunes.apple.com/lookup';
      url = `${apiUrl}?${stringify(query)}`;  
    } else {
      // otherwise search resource
      let query = {
        country: 'US',
        media: 'music',
        entity: 'album',
        term: input.search
      };
      let apiUrl = 'https://itunes.apple.com/search';
      url = `${apiUrl}?${stringify(query)}`;      
    }

    fetch(
      url,
      {method: "GET"}
    )
    .then(res => res.json())
    .then(response => {
      const albums = response.results.map(
        a => [
          a.collectionId, 
          <a href={"songs?collection=" + a.collectionId}>{a.collectionName}</a>, 
          a.artistName, 
          a.primaryGenreName
        ]
      )
      setData(albums);
    })
    .catch(error => console.log(error));    
  }

  useEffect(() => {
    search();
  }, []);

  useEffect(() => {
    setCurrentData(data.slice(offset, offset + pageLimit));
  }, [offset, data]);

  const handleInputChange = (e) => setInput({
    ...input,
    [e.currentTarget.name]: e.currentTarget.value
  })  

  return (
    <div>
      <div className={classes.searchWrapper}>
        <CustomInput
          formControlProps={{
            className: classes.margin + " " + classes.search
          }}
          inputProps={{
            placeholder: "Search",
            name: "search",
            inputProps: {
              "aria-label": "Search",
              "value": input.search,
              "onChange": handleInputChange
            }
          }}
        />
        <Button onClick={search} color="white" aria-label="edit" justIcon round>
          <Search />
        </Button>
      </div>

      <GridContainer>

        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>List of Albums</h4>
              <p className={classes.cardCategoryWhite}>
              Get any album from the iTunes Store
            </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["ID", "Album", "Artist", "Genre"]}
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
