import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
/*import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';*/
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
/*import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';*/

import IconButton from '@material-ui/core/IconButton';
//import CommentIcon from '@material-ui/icons/Comment';
import Slide from '@material-ui/core/Slide';

  class Listview extends React.Component {
    render () {
      console.log(this.props);
      const results = this.props.results;
      const details = this.props.details;
    return (
      <div>
      <center><h2>{details.name} ({details.englishName})</h2>
       <p>{details.englishNameTranslation}</p>
      </center>
        
        <List component='ul' disablePadding={false} dense={false} >
          {results.map((value, index) =>
            <ListItem key={index}>
              <ListItemText>
                <h4>{index + 1} - {value.text}</h4>
              </ListItemText>
              <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="Comments">
              
            </IconButton>
          </ListItemSecondaryAction>
              
            </ListItem>
            )
          }
          
        </List>
        
      </div>
    )
    }

  }  ;
  //<p>{value.surah.number}:{value.numberInSurah} <br />{value.number}</p>
  /*return (
    <div>
      <center><h1>Results</h1></center>
      {results.map((result, index) => (
        
        <div className="card" key ={index}>
          <div className="card-body">
            <h4>{result.surah.englishName}</h4>
            <p className="card-text">{result.number}</p>
          </div>
        </div>
      ))}
    </div>
  )*/
export default Listview