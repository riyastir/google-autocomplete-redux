import React, { useEffect, useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Card,
  Grid,
  Typography,
  Container,
  TextField,
  Box,
  useScrollTrigger,
  CssBaseline,
} from "@material-ui/core";
import Map from "./components/Map/Map";
import SearchList from "./components/SearchList/SearchList";
import { useSelector, useDispatch } from "react-redux";
import {
  add,
  selectSearches,
  fetchHistory,
} from "./components/SearchList/searchListSlice";

let autoComplete;

function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export default function App() {
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);
  const [coord, setCoord] = useState({ lat: 0, lng: 0 });
  const searchList = useSelector(selectSearches);
  const dispatch = useDispatch();

  const loadScript = (url, callback) => {
    let script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState) {
      script.onreadystatechange = function () {
        if (
          script.readyState === "loaded" ||
          script.readyState === "complete"
        ) {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      script.onload = () => callback();
    }

    script.src = url;

    document.getElementsByTagName("head")[0].appendChild(script);
  };

  function handleScriptLoad(updateQuery, autoCompleteRef) {
    autoComplete = new window.google.maps.places.Autocomplete(
      autoCompleteRef.current,
      { types: [], componentRestrictions: { country: "my" } }
    );
    autoComplete.setFields([
      "address_components",
      "formatted_address",
      "geometry",
    ]);
    autoComplete.addListener("place_changed", () =>
      handlePlaceSelect(updateQuery)
    );
  }

  const updateHistory = (val) => {
    dispatch(add(val || null));
  };

  async function handlePlaceSelect(updateQuery) {
    const addressObject = autoComplete.getPlace();
    const geoMetry = addressObject.geometry;
    const query = addressObject.formatted_address;
    updateQuery(query);
    setCoord({ lat: geoMetry.location.lat(), lng: geoMetry.location.lng() });
    updateHistory(addressObject.formatted_address);
  }

  useEffect(() => {
    if (window.google) {
      handleScriptLoad(setQuery, autoCompleteRef);
    } else {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`,
        () => handleScriptLoad(setQuery, autoCompleteRef)
      );
    }
    dispatch(fetchHistory());
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <ElevationScroll>
        <AppBar>
          <Toolbar>
            <Typography variant="h6">
              Google Place Autocomplete with Redux
            </Typography>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      <Container style={{ flexGrow: 1 }}>
        <Box my={2}></Box>
        <TextField
          id="place"
          name="place"
          inputRef={autoCompleteRef}
          onChange={(event) => setQuery(event.target.value)}
          label="Place"
          fullWidth
          value={query}
        />
        <Grid container spacing={3} style={{ marginTop: "10px" }}>
          <Grid item xs={12} sm={6}>
            <Card>
              <Map coord={coord} />
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card style={{ height: "600px", overflow: "auto" }}>
              <SearchList searchList={searchList}></SearchList>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}
