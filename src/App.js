
import React from 'react';
import './App.scss';
import 'typeface-roboto';
import Listview from './components/Listview/Listview';
import Loader from './components/Loader/Loader';

import Surahs from './assets/json/SurahList.json';
import Popup from "reactjs-popup";
import SurahInfo from './modules/SurahInfo/SurahInfo';
import {
  WhatsappShareButton,
  EmailShareButton,
} from 'react-share';

/*import {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  RedditShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  MailruShareButton,
  ViberShareButton,
  WorkplaceShareButton,
  EmailShareButton,
} from 'react-share';*/
//import TextField from '@material-ui/core/TextField';

//import PropTypes from 'prop-types';
//import { withStyles } from '@material-ui/core/styles';
//import AppBar from '@material-ui/core/AppBar';
//import Toolbar from '@material-ui/core/Toolbar';
//import Popover from '@material-ui/core/Popover';

//import Typography from '@material-ui/core/Typography';

//import Button from '@material-ui/core/Button';
//import Tabs from '@material-ui/core/Tabs';
//import Tab from '@material-ui/core/Tab';

//import FormGroup from '@material-ui/core/FormGroup';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Checkbox from '@material-ui/core/Checkbox';
//import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
//import CheckBoxIcon from '@material-ui/icons/CheckBox';
//import Favorite from '@material-ui/icons/Favorite';
//import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

//import Checkbox from './components/Checkbox/Checkbox';
//import Qry from 'query-string';

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        mainResult: [],
        inputVal: '',
        ayahDetails: {},
        rawData: {},
        surahList: [],
        searchError: '',
        searchBlockClass: 'search-wrapper',
        selectedSurah: {},
        selSurahNumber: 0,
        selectedTrans: '',
        preloader: true,
        langIsOpen: false,
        chkTrans: {'english': false, 'malayalam' : false},
        q_edition_ar: 'quran-simple-enhanced',
        q_edition_trans: ['en.asad', 'ml.abdulhameed'], //'en.pickthall', 
        q_edition_audio: 'ar.alafasy',
        navBtnClass: {'back':'nav-btn back', 'next':'nav-btn next'},
        searchBtnClass: 'search-btn inactive'
      }
      //const langs = JSON.parse('./langs.json');
      this.handleLoad = this.handleLoad.bind(this);
      this.processData = this.processData.bind(this);
      this.resetView = this.resetView.bind(this);
      this.searchForAyah = this.searchForAyah.bind(this);
      this.langPopupOnOpen = this.langPopupOnOpen.bind(this);
    }
    
    
    resetView() {
      //alert('asdf');
      this.setState({
        inputVal: '',
        ayahDetails: null,
        mainResult: [],
        rawData: null,
        searchError: '',
        selectedSurah: {},
        selSurahNumber: 0,
        langIsOpen: false,
        selectedTrans: '',
        chkTrans: {'english': false, 'malayalam' : false}
      })
    }
    componentDidMount() {
     
     
      this.setState({
         preloader: true
      }, () => window.addEventListener('load', this.handleLoad));
    }
    
    handleLoad(){
      
      //check whether the url has any parameters to process 
     
      let url_param = window.location.search;
      let process_url = false;
      if(url_param){
        if(url_param.split(':').length <= 1){
          if(url_param){
            if(Number(url_param)){
              process_url = true;
            } else {
              process_url = false;  
            }
          } else{
            process_url = false;
          }
        } else {
          //process_url = true;
          if(url_param.split(':')[0] && url_param.split(':')[0] !== ''){
            if(Number(url_param.split(':')[0])) {
              process_url = true;
            } else {
              process_url = false;
            }
          } else {
            process_url = false;
          }
        }
        
      }
      if(process_url) {
        console.log('process_url' + url_param);
      }
       this.setState({
          surahList: Surahs.data,
          preloader: false
        });
    }

    langPopupOnOpen(){
      this.setState({
        langIsOpen: true
      })
    }
    validateInput(value){
      let isValid = true;
      let totAyahs;
      if(this.state.selectedSurah.number){
        totAyahs = Number(this.state.selectedSurah.numberOfAyahs);
      }
      else {
        totAyahs = 6236;
      }
      
      if(Number(value) > totAyahs){
        isValid = false;
      }
      return isValid;
    }
    searchForAyah(event) {
      let filter = Number(this.state.inputVal);
      
      let q_editions = (this.state.q_edition_ar + ',' + this.state.q_edition_trans + ',' + this.state.q_edition_audio) ;
      this.setState({
         preloader: true
      });
        

      if(this.state.ayahDetails && this.state.ayahDetails.audio){
        console.log(this.state.mainResult[0]);
        this.setState({
          preloader: true,
          ayahDetails: {audio: ''}
        })
      }
      let isRefValid = this.validateInput(filter);
    
      if(!filter || !isRefValid){
        console.log(this.state.searchError);
        this.setState({
         preloader: false
        });
        return false;
      }


      if(String(filter).split(':').length <= 1){
        if(this.state.selSurahNumber > 0){
          filter = this.state.selSurahNumber + ":" + filter;
        } 
      } 
      const cachedFetch = (url, options) => {
        // Use the URL as the cache key to sessionStorage
      let cacheKey = url
      // START new cache HIT code
      let cached = sessionStorage.getItem(cacheKey)
      if (cached !== null) {
        // it was in sessionStorage! Yay!
        console.log('already cached')
        let response = new Response(new Blob([cached]));
        return Promise.resolve(response);
      }
      // END new cache HIT code
      return fetch(url, options).then(response => {
        // let's only store in cache if the content-type is
        // JSON or something non-binary
        let ct = response.headers.get('Content-Type')
        if (ct && (ct.match(/application\/json/i) || ct.match(/text\//i))) {
          // There is a .json() instead of .text() but
          // we're going to store it in sessionStorage as
          // string anyway.
          // If we don't clone the response, it will be
          // consumed by the time it's returned. This
          // way we're being un-intrusive.
          response.clone().text().then(content => {
            sessionStorage.setItem(cacheKey, content)
          })
        }
        return response
        })
      }

     
        cachedFetch('https://api.alquran.cloud/v1/ayah/' + filter + '/editions/' + q_editions)
          .then(res => res.json())
          .then((data) => {
            console.log(data.data[0]);
            this.setState({
              selectedSurah: data.data[0].surah,
              selSurahNumber: data.data[0].surah.number,
              inputVal: data.data[0].numberInSurah,
              searchError:'',
              rawData :data
            }, () => this.processData(data));
          })
          .catch(
            this.setState({
             searchError: 'data error'
            })
          )
        
    }
    
     processData(results) {
      let res = [];
      let audio = '';
      let details = null;
      let result = this.state.rawData;
     
      if(!result || !result.data){
        console.log('no data');
        return false;
      }
      
        result.data.map(item => {
            let filteredItem = null;
            var flag = true;
            /* separate audio details */
            if(!item.audio){
              
              filteredItem = {'edition': item.edition, 'text': item.text};
              switch(item.edition.language){
                case 'en':
                  flag = this.state.chkTrans.english;
                  break;
                case 'ml':
                  flag = this.state.chkTrans.malayalam;
                  break;
                default:
                  flag = true;
                  
              }
              if(flag){
                res.push(filteredItem);
              }
              flag = true;
            }
            else{
              if(audio === ''){
                audio = item.audio;
              }
            }
            
            if(!details){

              details = item.surah;
              
              details = Object.assign(details, {
                'hizbQuarter': item.hizbQuarter,
                'juz': item.juz,  
                'manzil': item.manzil,
                'ayahNumber': item.number,
                'numberInSurah': item.numberInSurah,
                'page': item.page,
                'ruku': item.ruku,
                'sajda': item.sajda
              });
            }
            return true;
          }
        )
        
        if(audio){
          details = Object.assign(details, {'audio': audio});
        }
        this.setState({ 
          ayahDetails: details, 
          mainResult: res,
          preloader: false
          
        });
        return true;
    }
    
    updateInputVal(evt) {
      let value = evt.target.value;
      let isValid = this.validateInput(value);
      let navBackClass = this.state.navBtnClass.back;
      let navNextClass = this.state.navBtnClass.next; 
      let searchBtn;
      
      if(isValid){
        this.setState({
          inputVal: evt.target.value
        });
      } 

      if(!Number(value)){
        searchBtn = 'search-btn inactive';
      } else {
        searchBtn = 'search-btn';
      }
      if(value <= 1){
        navNextClass = 'nav-btn next';
        navBackClass = 'nav-btn back disabled';
      } else {
        navBackClass = 'nav-btn back';
        if(this.state.selSurahNumber > 0 && value === this.state.selectedSurah.numberOfAyahs){
          navNextClass = 'nav-btn next disabled';
        } else {
          navNextClass = 'nav-btn next';
        }
      }
      this.setState({
        searchBtnClass: searchBtn,
        navBtnClass: {
          back: navBackClass,
          next: navNextClass
        }
      })

    }
    verifyInputKey(evt) {
      //console.log('asdf');
      if(evt.keyCode === 186) { 
        this.setState({
          selSurahNumber: evt.target.value,
          inputVal: ''
        },() => this.fetchSurahDetails(Number(this.state.selSurahNumber)));
      }
    }

    selectSurah = (evt) => {
      //console.log(evt.target.value || evt.target.getAttribute('data-value'));
      let dataVal = evt.target.value || evt.target.getAttribute('data-value');
      
      this.setState({
        preloader: true
      }, () => this.fetchSurahDetails(Number(dataVal)));
    }
    fetchSurahDetails(dataVal){
      let selSurah = [];
      if(dataVal > 0){
        selSurah = this.state.surahList.filter(surah => Number(surah.number) === Number(dataVal));
        
        this.setState({
          selectedSurah: selSurah[0],
          selSurahNumber: selSurah[0].number
        }, () => {console.log(this.state.selectedSurah)});
      }
      
      this.setState({ 
        ayahDetails: {},
        mainResult: [], 
        preloader: false
      }, () => {this.ayahInput.focus()});
      
    }
/*findLang(array, title) {
    let result = array.filter(item => item.code === title );
    if(result.length){
      return result[0];
    } else {
      return false;
    }
}*/

navigateAyah = (evt) => {
  let data = evt.target.getAttribute('data-value');
  let valNow = Number(this.state.inputVal);
  let totAyahs = Number(this.state.selectedSurah.numberOfAyahs); 
  let navBackClass = this.state.navBtnClass.back;
  let navNextClass = this.state.navBtnClass.next; 
  switch (data){
    case "back":  
      if(valNow > 1) {
        valNow--;
      }
      break;
    case "next":
      if(valNow < totAyahs) {
        valNow++;
      }
      break;
      
    default:
  }
   if(valNow === 1){
      navNextClass = 'nav-btn next';
      navBackClass = 'nav-btn back disabled';
    } else {
      navBackClass = 'nav-btn back';
      if(this.state.selSurahNumber > 0 && valNow === this.state.selectedSurah.numberOfAyahs){
        navNextClass = 'nav-btn next disabled';
      } else {
        navNextClass = 'nav-btn next';
      }
    }
  this.setState({
    inputVal: String(valNow),
    navBtnClass: {back: navBackClass, next: navNextClass}
  }, () => this.searchForAyah(evt));
  
}
  render(){
    let listview;
// url is 'https://www.example.com/user?id=123&type=4';
  

    if(this.state.mainResult.length){
      listview = <Listview 
        key={this.state.ayahDetails && this.state.number} 
        results={this.state.mainResult} 
        details={this.state.ayahDetails}
        />
    }
    const surahs = this.state.surahList;
    
    /*const closeBubble = (evt) => {
      console.log(evt.target);
    }*/
    const SurahPopup =  () => (
      <Popup
        trigger={<button value="Surahs" className="surah-button">Surah</button>}
        on="click"
        position="center center"
        modal
        closeOnDocumentClick
        className="surah-popup"
        onRequestClose={() => {
          this.setState({ modalIsOpen: false });
        }}
      >
      <div className="surah-wrapper">
        <h3>Select Surah:</h3>
        <ul className="surah-list-ul">
          <li className="row-flex list-heads">
            <p className="sno" >No.</p>
            <p className="sname">Surah Name</p>
            <p className="sayah">Ayahs</p>
          </li>
        {
          surahs.map(surah => <li  key={surah.number} value={surah.number} className="row-flex" onClick={this.selectSurah}>
          
            <span data-value={surah.number} className="sno">{surah.number}</span>
            <span data-value={surah.number} className="sname">{surah.englishName}</span>
            <span data-value={surah.number} className="sayah">{surah.numberOfAyahs}</span>
          
          </li>)
        }
        </ul>
      </div>
      </Popup>
    )
    const selectedSurah = this.state.selectedSurah;
   //alert(this.state.selectedTrans);
   //<a href="javascript:;" onClick={this.searchForAyah} role="button" className={this.state.searchBtnClass}>Search</a>
console.log(window.location.search);
    let share_url = '';
    if(selectedSurah && this.state.inputVal){
      share_url = window.location + '?' + selectedSurah.number + ':' + this.state.inputVal;
  }

  return (
    <div className="page-wrapper">
      <header className="App-header">
       <h1 onClick={this.resetView}>
          Q-Search
       </h1>
       {(share_url !== '') &&
       <WhatsappShareButton title="Q-search - Find Ayahs in Qur'an" url={share_url} className="wa-btn" />
       }
      </header>
      {
        selectedSurah.number && 

        <SurahInfo 
          details={this.state.ayahDetails} 
          onNavNext={this.navigateAyah} 
          onNavBack ={this.navigateAyah} 
          selectedSurah ={selectedSurah}
          navBackClass = {this.state.navBtnClass.back}
          navNextClass = {this.state.navBtnClass.next}
          langPopupOpen = {this.state.langIsOpen}
          selectedLang = {this.state.selectedTrans}
          translations = {this.state.chkTrans}
          inputVal = {this.state.inputVal}
          langPopupOnOpen = {this.langPopupOnOpen}
          refreshData = {this.processData}
          />
      }
        <section className={this.state.searchBlockClass} id="search-block">
        <div className="row-flex ayah-input-wrapper" >
          <div className="row-flex surah-select-wrapper" >
            <div className="help-bubble left bottom" onClick={(evt) => this.closeBubble} hidden >
              <p>Tap to select Surah here.</p>
            </div>
            <SurahPopup />
            
            {this.state.selSurahNumber > 0 && 
              <p ref={(sur) => { this.surahLabel = sur; }} className="surah-name">{this.state.selSurahNumber}:</p>
            }
          </div>
          <div className="ayah-input">
            <label hidden>Ayah Number:</label>
            <input type="number"
              value={this.state.inputVal}
              onChange={evt =>this.updateInputVal(evt)}
              onKeyDown={evt => this.verifyInputKey(evt)}
              placeholder="Ayah No."
              ref={(input) => { this.ayahInput = input; }} 
              className="input-ayah"
              pattern="^[0-9]*$"
              min="1"
              max={this.state.selectedSurah.numberOfAyahs}
            />
            
              <label ref={(sur) => { this.surahLabel = sur; }} className="ayah-total">of {this.state.selectedSurah.numberOfAyahs ? this.state.selectedSurah.numberOfAyahs : 6236 }</label>
            
          </div>
          <button onClick={this.searchForAyah} className={this.state.searchBtnClass} value="Search" >Search</button>
         </div> 
        </section>
      <div className='content-wrapper'>
        {listview}
         
      </div>
      
      { this.state.preloader && 
        <Loader />
        
      }
    </div>
  );
  }
}

export default App;
