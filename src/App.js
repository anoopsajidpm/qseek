
import React from 'react';
//import logo from './logo.svg';
import './App.scss';
import 'typeface-roboto';
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

import Listview from './components/Listview/Listview';
import Loader from './components/Loader/Loader';
import Langs from './assets/json/langs.json';
import Surahs from './assets/json/SurahList.json';
import Popup from "reactjs-popup";
import SurahInfo from './modules/SurahInfo/SurahInfo';

//import Checkbox from './components/Checkbox/Checkbox';

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
        q_edition_trans: ['en.asad', 'en.pickthall', 'ml.abdulhameed'],
        q_edition_audio: 'ar.alafasy',
        navBtnClass: {'back':'nav-btn back', 'next':'nav-btn next'}
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
      window.addEventListener('load', this.handleLoad);
    }
    
    
    handleLoad(){
      //console.log(Langs);
      this.setState({
         preloader: true
      });
      
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
      //console.log(value);
      //let selSurah = this.state.selectedSurah;
      //let errMsg = '';
      let isValid = true;
      let totAyahs;
      console.log(value);
      if(this.state.selectedSurah.number){
        totAyahs = Number(this.state.selectedSurah.numberOfAyahs);
      }
      else {
        totAyahs = 6236;
      }
      
      if(value > totAyahs){
        isValid = false;
      }
      console.log(value);
      return isValid;
    }

    searchForAyah(event) {
     
      //console.log(this.state.preloader);
      let filter = Number(this.state.inputVal);
      let q_editions = (this.state.q_edition_ar + ',' + this.state.q_edition_trans + ',' + this.state.q_edition_audio) ;
      this.setState({
         preloader: true
        });

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

      this.setState({
         preloader: true
      }, () => {
        cachedFetch('https://api.alquran.cloud/v1/ayah/' + filter + '/editions/' + q_editions)
          .then(res => res.json())
          .then((data) => {
            console.log(this.state.preloader);
            console.log('done...');
            this.setState({
              searchError:'',
              rawData :data
            }, () => this.processData(data));
          })
          .catch(
            this.setState({
             preloader: false,
             searchError: 'data error'
            })
          )
        }
      );
    }
    
    /*getErrMessage(src) {
      let message = '';
      //let inp = this.state.inputVal;
      let splitV = this.state.inputVal.split(':');
      let curSurah = this.state.selectedSurah;
      if(src === 'list'){
        message = 'Surah list data error';
      } else {
        if(splitV.length > 1){
          if(Number(splitV[0]) > 114 || Number(splitV[0]) < 1){
            message = 'Invalid Surah reference';
          } else {
            if(curSurah && (Number(splitV[1]) < 1 || Number(splitV[1]) > Number(curSurah.numberOfAyahs))){
              message = 'Invalid Ayah number. Enter Ayah 1 through ' + curSurah.numberOfAyahs;
            } else {
              message = ''
            }
          }
        } else {
          if(Number(splitV[0]) < 1 || Number(splitV[0]) > 60232){
            message = 'Invalid Ayah number. Enter any from 1 to 60232';
          } else {
            message = '';
          }
        }
      }
      return message;
      
    }*/
    
     processData(results) {
      let res = [];
      let audio = '';
      let details = null;
      let result = this.state.rawData;

      /*this.setState({ 
        ayahDetails: {},
        mainResult: [],
        preloader: true
      });*/
      
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
      //console.log(evt.target.value);
      if(isValid){
        this.setState({
          inputVal: evt.target.value
        });
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
        navBtnClass: {
          back: navBackClass,
          next: navNextClass
        }
      })

    }
    verifyInputKey(evt) {
      if(evt.keyCode === 186) { // || evt.keyCode === 189){
        this.setState({
          selSurahNumber: evt.target.value,
          inputVal: '', 
          preloader: true
        },() => this.fetchSurahDetails(Number(this.state.selSurahNumber)));
      }
    }

    selectSurah = (evt) => {
      console.log(evt.target.value || evt.target.getAttribute('data-value'));
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
    
    selectLang = evt => {
      console.log(evt.target.getAttribute('data-value'));
      
      let lng = evt.target.getAttribute('data-value');
      let eng = this.state.chkTrans.english;
      let mal = this.state.chkTrans.malayalam;
      switch (lng){
        case 'en':
          eng = true; //!eng;
          mal = false;
          break;
        case 'ml':
          mal = true; //!mal;
          eng = false;
          break;
        default:
      }
      this.setState({
        chkTrans:{
          english: eng,
          malayalam: mal
        },
        selectedTrans: this.findLang(Langs, lng),
        langIsOpen: false
      }, () => {
          this.processData(this.state.rawData);
      });
      
    } 
    
    

findLang(array, title) {
//console.log('find');
  
      let result = array.filter(item => item.code === title );
      if(result.length){
        return result[0];
      } else {
        return false;
      }
}

navigateAyah = (evt) => {
  //console.log(evt.target.getAttribute('data-value'));
  let data = evt.target.getAttribute('data-value');
  let valNow = Number(this.state.inputVal);
  let totAyahs = Number(this.state.selectedSurah.numberOfAyahs); 
  let navBackClass = this.state.navBtnClass.back;
  let navNextClass = this.state.navBtnClass.next; 
  switch (data){
    case "back":  
      if(valNow > 1) {
       // navBackClass = 'nav-btn back'; 
        valNow--;
      }
      break;
    case "next":
      if(valNow < totAyahs) {
        //navNextClass = 'nav-btn next';
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
    navBtnClass: {back: navBackClass, next: navNextClass},
  }, () => this.searchForAyah(evt));
  
}
  render(){
    
    /* <select id="surah-list" onChange={evt => this.changeSurah(evt)} className="surah-select">
      <option value="0" >--Select--</option>
      { 
        surahs.map(el => <option value={el.number} key={el.number} > {el.number} - {el.englishName} </option>)
      }
    </select>
    
    <button className="toggle-btn" value="malayalam" onClick={this.chkSelectChange}>Mal</button>
    */
    let listview;

    //console.log(this.langs);
    if(this.state.mainResult.length){
      listview = <Listview 
        key={this.state.ayahDetails && this.state.number} 
        results={this.state.mainResult} 
        details={this.state.ayahDetails}
        />
    }
    //console.log(this.findLang(Langs, 'ml'));
    //let surah = {};
    const surahs = this.state.surahList;
    //const filteredLangs = Langs.filter(item => item.code === 'en' || item.code === 'ml' );
    //const chapters = Surahs.data;
    //console.log(chapters);
    //console.log(langs);
   /*let selectedTrans = () => {
    let selection = ''
    if(this.state.chkTrans.english){
      selection = 'English';
    } else {
      if(this.state.chkTrans.malayalam){
        selection = 'Malayalam';
      } else {
        selection = 'None';
      }
    }
    this.setState({
      selectedTrans: selection
    })
    return selection;
   }*/
    
    /*const LangPopup =  () => (
      <Popup
        trigger={<a href="javascript:;" className="toggle-btn align-self-center margin top" value="Translation" >Translation: {selectedTrans} </a>}
        on="click"
        position="center center"
        modal
        closeOnDocumentClick
      >
      <div className="surah-wrapper">
        <h3>Select Language:</h3>
        <ul>
        {
          filteredLangs.map(lng=> 
            <li 
            data-value={lng.code} 
            key={lng.code} 
            onClick={this.selectLang} >{lng.code} - {lng.name} </li>
          )
        }
        </ul>
      </div>
      </Popup>
    )*/

        
    const SurahPopup =  () => (
      <Popup
        trigger={<a href="javascript:;" value="Surahs" className="surah-button">Surah</a>}
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
          
    /*<label htmlFor="surah-list">Surah:</label>
      <AppBar position="static" color="default">
      <Toolbar>
        <Typography variant="h1" size="small" color="inherit">
          Q-Search
        </Typography>
      </Toolbar>
    </AppBar>

    <section className="titles-wrapper">
        
          <h2 className="surah-title">{selectedSurah.englishName} | {selectedSurah.name}</h2>
          <p>Surah: <span className="clearer">{selectedSurah.number}</span> | {selectedSurah.englishNameTranslation}</p>
          <LangPopup />
          <div className="row-flex ayah-nav-wrapper margin top">
            <a href="javascript:;" className={this.state.navBtnClass.back} data-value="back" onClick={this.navigateAyah}>Back</a>
              <p>Ayah: <span className="clearer">{this.state.inputVal ? this.state.inputVal : 'Not Selected'}</span></p>
            <a href="javascript:;" className={this.state.navBtnClass.next} data-value="next" onClick={evt => this.navigateAyah(evt)}>Next</a>
           </div>
      </section>
    */
    const selectedSurah = this.state.selectedSurah;
   //alert(this.state.selectedTrans);
   const queryString = require('query-string');
//var location = this.location;
console.log(queryString);
//console.log(queryString.parse(location.search));
  return (
    <div className="page-wrapper">
      <header className="App-header">
       <h1 onClick={this.resetView}>
          Q-Search
       </h1>
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
          onSelectLang = {this.selectLang}
          selectedLang = {this.state.selectedTrans}
          translations = {this.state.chkTrans}
          inputVal = {this.state.inputVal}
          langPopupOnOpen = {this.langPopupOnOpen}
          refreshData = {this.processData}
          />
      }
      
      
        <section className={this.state.searchBlockClass} id="search-block">
        <div className="row-flex ayah-input-wrapper" >
          <div className="row-flex">
            
            <SurahPopup />
            <div className="triangle-right"><div className="inner"></div></div>
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
            {this.state.selectedSurah.englishName && 
              <label ref={(sur) => { this.surahLabel = sur; }} className="ayah-total">of {this.state.selectedSurah.numberOfAyahs}</label>
            }
          </div>
          <a href="javascript:;" onClick={this.searchForAyah} role="button" className="search-btn">Search</a>
          
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
//onChange={handleChange('checkedF')}
export default App;
