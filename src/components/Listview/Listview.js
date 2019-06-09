import React from 'react';
import List from '@material-ui/core/List';
//import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
/*import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';*/
//import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
/*import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';*/
//import Modal from '@material-ui/core/Modal';
import Popup from "reactjs-popup";
import Langs from '../../langs.json';
//import IconButton from '@material-ui/core/IconButton';
//import CommentIcon from '@material-ui/icons/Comment';
//import Slide from '@material-ui/core/Slide';
import './Listview.scss';

//import Copier from '../../modules/Copier/Copier';

  class Listview extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      }
    }
    componentWillUnmount = () => {
        console.log('asdf');
    }
    onClickNavigate = (evt) => {
      let curAyah = this.props.details.numberInSurah;
      let surah = this.props.details.number;
      let totAyah = this.props.details.numberOfAyahs;
      
      
      switch(evt.target.value){
        case "Next":
          if(curAyah < totAyah){
            curAyah++;
          } else {
            if(surah < 114){
              surah++;
              curAyah = 1;
            } else {
              console.log('You are on the last Ayah of the last Surah');
            }
          }
          console.log(surah + ':' + curAyah);
          //curAyah = this.props.details.numberOfAyahs
          break;
        case "Prev":
          if(curAyah > 1){
            curAyah--;
          } else {
            if(surah > 1){
              surah--;
            } else {
              console.log('You are on the first Ayah of the first Surah');
            }
          }
          console.log(surah + ':' + curAyah);
          break;
        default:
          console.log('asd');
          break;
      }
    }
     getLangName(code) {
            let lang = Langs.filter(item => item.code === code);
            console.log(lang);
            return (lang[0].name !== 'English' ? lang[0].name + ' | ' + lang[0].nativeName : lang[0].name);
          }
    render () {
      //console.log(this.props);
      const results = this.props.results;
      const details = this.props.details;
      
      if(!this.props.results) return null;
      
      //console.log(details);
      const PopupOnFocus =  () => (
        <Popup
          trigger={<button value="More Info">More Info</button>}
          on="click"
          position="right center"
          closeOnDocumentClick
        >
        <div><center>
          <h2>{details.name}</h2>
          <p>{details.englishName} | {details.englishNameTranslation}</p>
           <p>Surah: {details.number} | Ayah: {details.numberInSurah}</p>
           
          </center>
        </div>
        </Popup>
      )
      
      
      /*<ListItemSecondaryAction>
            <IconButton hidden edge="end" aria-label="Comments">
              
            </IconButton>
          
          </ListItemSecondaryAction>
          <p>Ref: <span>{details.number}:{details.numberInSurah}</span></p>
        
        <PopupOnFocus />
          */
         
    return (
      <div className="listview-wrapper">
      <button hidden onClick={this.onClickNavigate} value="Prev" >prev</button>
      
      
        <button hidden onClick={this.onClickNavigate} value="Next" >next</button>
        <List component='ul' disablePadding={false} dense={false} className="verse-list-ul">
          {results.map((value, index) =>
            <ListItem key={index} className="no-padding">
              <ListItemText className="verse-text" >
              { value.edition.type === 'translation' &&
                <span className="ayah-details">{this.getLangName(value.edition.language)}</span>
              }

              { value.edition.language === 'ar' && 
                    
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

  }  ;
 
export default Listview