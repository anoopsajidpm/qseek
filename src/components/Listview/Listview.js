import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Langs from '../../assets/json/langs.json';
import './Listview.scss';

//import Box from '@material-ui/core/Box';
/*import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';*/
//import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
/*import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';*/
//import Modal from '@material-ui/core/Modal';
//import Popup from "reactjs-popup";
//import IconButton from '@material-ui/core/IconButton';
//import CommentIcon from '@material-ui/icons/Comment';
//import Slide from '@material-ui/core/Slide';
//import Copier from '../../modules/Copier/Copier';

  const getLangName = (code) => {
    // function to get the language name from code
    let lang = Langs.filter(item => item.code === code);
    //console.log(lang);
    return (lang[0].name !== 'English' ? lang[0].name + ' | ' + lang[0].nativeName : lang[0].name);
  }

  function Listview(props) {
    
    const results = props.results;
    const details = props.details;

    if(!props.results) return null;

    return (
      <div className="listview-wrapper">
        <List component='ul' disablePadding={false} dense={false} className="verse-list-ul">
          {results.map((value, index) =>
            <ListItem key={index} className="no-padding">
              <ListItemText className="verse-text" >
              { value.edition.type === 'translation' &&
                <span className="ayah-details">{getLangName(value.edition.language)}</span>
              }

              { (value.edition.language === 'ar' && details.audio) && 
                <audio controls="controls" className="q-audio-player">
                  <source src={details.audio} type="audio/wav" />
                  Your browser does not support the <code>audio</code> element. 
                </audio>
              }
              <p className={value.edition.language === 'ar'? "txt-arabic" :''}>{value.text}</p>
                
            </ListItemText>
          </ListItem>
          )
        }
        </List>
      </div>
    )
  }
    
export default Listview