import React from 'react';
import List from '@material-ui/core/List';
//import Box from '@material-ui/core/Box';
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
import './Listview.scss';

  class Listview extends React.Component {
    render () {
      console.log(this.props);
      const results = this.props.results;
      const details = this.props.details;
    return (
      <div className="listview-wrapper">
      <center><h2>{details.name}</h2>
      <p>{details.englishName} | {details.englishNameTranslation}</p>
       <p>Surah: {details.number} | Ayah: {details.numberInSurah}</p>
      </center>
        
        <List component='ul' disablePadding={false} dense={false} >
          {results.map((value, index) =>
            <ListItem key={index} className="no-padding">
              <ListItemText className="verse-text">
                <span className="ayah-details">{value.edition.type === 'translation' ? value.edition.englishName : ''}</span>
                <p>{value.text}</p>
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