import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

  class Listview extends React.Component {
    render () {
      const {results} = this.props;
    return (
      <div>
      <center><h1>Results</h1></center>
      
        <List component='ul' disablePadding={false} dense={false} >
          {results.map(value =>
            <ListItem>
              <p>{value.surah.number}:{value.numberInSurah} <br />{value.number}</p>
              <ListItemText
                primary={value.text} >
                
              </ListItemText>
              <p>testing</p>
              
            </ListItem>
            )
          }
        </List>
      </div>
    )
    }

  }  ;
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