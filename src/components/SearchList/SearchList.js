import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";

const SearchList = ({searchList}) => {
  return (
    <div>
      <Typography variant="h5" component="h5" style={{ padding: "30px",textAlign:"center" }}>
        Recent Searches
      </Typography>
      <List component="nav" aria-label="recent searches">
        {searchList.length === 0 ? (
          <Typography
            variant="h6"
            component="h6"
            style={{ padding: "30px", textAlign: "center" }}
          >
            No recent searches
          </Typography>
        ) : (
          searchList.map((val, index) => (
            <ListItem key={index} button>
              <ListItemText primary={val} />
            </ListItem>
          ))
        )}
      </List>
    </div>
  );
};

export default SearchList;