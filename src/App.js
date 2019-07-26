
//main
import React from 'react';

//styles
import './App.scss';

//downloaded componenets
import 'typeface-roboto'; // font support 
import {
  WhatsappShareButton,
  EmailShareButton,
  WhatsappIcon,
  EmailIcon
} from 'react-share';
import Popup from "reactjs-popup";

//JSON
import Surahs from './assets/json/SurahList.json';
import trans_conf from './assets/json/lang_config.json';
import Langs from './assets/json/langs.json';
import Editions from './assets/json/editions.json';

//custom componenets
import SurahInfo from './modules/SurahInfo/SurahInfo';
import Listview from './components/Listview/Listview';
import Loader from './components/Loader/Loader';

//custom modules 
// import {appMods} from './modules/App/AppModules';
//unused - to remove
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
      preloader: true,
      defaultTrans: {},
      //filteredLangs: {},

      q_edition_ar: 'quran-simple-enhanced',
      q_edition_trans: ['en.asad', 'ml.abdulhameed'], //'en.pickthall', 
      q_edition_audio: 'ar.alafasy',
      navBtnClass: { 'back': 'nav-btn back', 'next': 'nav-btn next' },
      searchBtnClass: 'search-btn inactive',
      url_search: '',
      totalQuranAyahs: 0,
      shareBody: '',
      versesNowShowing: []
    }
    //const langs = JSON.parse('./langs.json');
    this.handleLoad = this.handleLoad.bind(this);
    this.processData = this.processData.bind(this);
    this.resetView = this.resetView.bind(this);
    this.searchForAyah = this.searchForAyah.bind(this);
    this.selectTranslation = this.selectTranslation.bind(this);
  }

  // - ---- reload page with reset values
  resetView() {
    window.location.search = '';
  }

  componentDidMount() {
    this.setState({
      preloader: true
    }, () => window.addEventListener('load', this.handleLoad));
  }

  //----- on page load  
  handleLoad() {
    // initialize with startup values - surah list, total ayah count, url string & search, default translation selected if any. 
    this.setState({
      surahList: Surahs.data,
      totalQuranAyahs: this.getTotalAyahCount(Surahs.data),
      url_origin: window.location.origin,
      url_search: this.extractSearchStrings(window.location.search),
      defaultTrans: trans_conf.filter(item => item.active)[0],
      preloader: false
    }, () => this.checkForSearchString());


  }

  // ---- get total number of ayahs in Qur'an 
  getTotalAyahCount(surahs) {
    let totalAyah = 0;
    surahs.map(sur => {
      totalAyah += sur.numberOfAyahs
    })
    return totalAyah;
  }

  // --- check the ayah number provided in url string
  checkForSearchString() {
    let search_string = this.state.url_search;
    console.log(search_string);

    if (search_string) {
      let sur; // = search_string.split(':')[0];
      if (search_string.split(':').length >= 2) {
        sur = search_string.split(':')[0];
        this.getSurahDetails(sur);





      } else {
        if (Number(search_string) <= this.state.totalQuranAyahs) {
          this.setState({
            inputVal: search_string
          }, () => this.searchForAyah());
        } else {
          console.log('Invalid reference');
        }
      }

    }
  }

  // --- extract surah & ayah numbers from url string
  extractSearchStrings(url_param) {

    //let url_param = window.location.search;
    let url_string = '';
    //let url_param = this.state.url_search;
    let str_split = [];
    let valid;
    if (url_param) {
      url_param = String(url_param).replace('?', '');
      str_split = url_param.split(':'); // if -> ?<surahnumber>:<ayahnumber>
      if (str_split.length > 1) {
        str_split.map(str => {
          if (Number(str)) {
            valid = true;
          } else {
            valid = false;
          }
        });
        if (valid) {
          url_string = url_param;
        }
      } else {
        str_split = url_param.split('&'); // if -> ?surah=<num>&ayah=<num>
        let res = [];
        if (str_split.length > 1) { // if param has 2 parts
          str_split.map(str => {
            let parts = str.split('='); // e.g: foo='bar'
            if (parts.length === 2) { // if <search>=<value>
              if (Number(parts[1])) {
                res.push(parts[1]);
              }
            } else {
              if (Number(parts[0])) {
                res.push(parts[0]);
              }
            }
          });
          url_string = String(res).replace(',', ':');
        } else { // if param has only 1 part
          let parts = str_split[0].split('='); // e.g: foo='bar'
          if (parts.length === 2) { // if <search>=<value>
            if (Number(parts[1])) {
              url_string = parts[1];
            }
          } else {
            if (Number(parts[0])) {
              url_string = parts[0];
            }
          }
        }

      }

    }
    return url_string
  }

  // -- get the languages opted by user
  /*filteredTrans() {
      let res = [];
      let test = {};
      trans_conf.map(lng => {
          let temp = Langs.filter(item => item.code === lng.code)[0];
          res.push(temp);
          temp.active = Number(lng.active)? true :false;
          
          if(Number(lng.active)){
              this.selectTranslation(temp);
          }
      })
      //console.log(this.state.selectedTrans);
      return res;
  }*/

  // -- validate the ayah number input from user
  validateInput(value) {
    let isValid = true;
    let totAyahs;
    if (this.state.selectedSurah.number) {
      totAyahs = Number(this.state.selectedSurah.numberOfAyahs);
    }
    else {
      totAyahs = 6236;
    }

    if (Number(value) > totAyahs) {
      isValid = false;
    }
    return isValid;
  }

  // --  search for ayah result 
  searchForAyah(event) {
    let filter = Number(this.state.inputVal);
    let loader = this.state.preloader;
    let q_editions = (this.state.q_edition_ar + ',' + this.state.q_edition_trans + ',' + this.state.q_edition_audio);

    if (this.state.ayahDetails && this.state.ayahDetails.audio) {
      // reset existing audio data 
      this.setState({
        ayahDetails: { audio: '' }
      })
    }

    if (!loader) {
      this.setState({
        preloader: true
      });
    }
    let isRefValid = this.validateInput(filter);

    if (!filter || !isRefValid) {
      console.log(this.state.searchError);
      this.setState({
        preloader: false
      });
      return false;
    }


    if (String(filter).split(':').length <= 1) {
      if (this.state.selSurahNumber > 0) {
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
          searchError: '',
          rawData: data
        }, () => this.processData(data));
      })
      .catch(
      this.setState({
        searchError: 'data error'
      })
      )

  }

  // -- select the translation from drop down
  selectTranslation(trans) {
    console.log(trans);

    let refreshData = false;
    if (this.state.defaultTrans) {
      if (trans) {
        if (this.state.defaultTrans.code !== trans.code) {
          refreshData = true;
        }
      } else {
        refreshData = true;
      }
    } else {
      if (trans) {
        refreshData = true;
      }
    }
    if (refreshData) {
      this.setState({
        defaultTrans: trans
      }, () => this.processData(this.state.rawData));
    }
  }

  // -- process the data retreived from ayah api - the main result 
  processData(results) {
    let res = [];
    let audio = '';
    let details = null;
    let result = this.state.rawData;
    let verseShowing = [];

    if (!result || !result.data) {
      console.log('no data');
      return false;
    }

    result.data.map(item => {
      let filteredItem = null;
      var flag = false;
      /* separate audio details */
      if (!item.audio) {

        filteredItem = { 'edition': item.edition, 'text': item.text };

        if (item.edition.language === 'ar') {
          flag = true;

        } else {
          if (this.state.defaultTrans) {
            if (item.edition.language === this.state.defaultTrans.code) {
              flag = true;
            }
          }
        }

        if (flag) {
          verseShowing.push(item.text + "\n[Qur'an - " + this.state.selSurahNumber + ':' + this.state.inputVal + ']\n---');
          res.push(filteredItem);
        }
        //flag = true;
      }
      else {
        if (audio === '') {
          audio = item.audio;
        }
      }

      if (!details) {

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

    if (audio) {
      details = Object.assign(details, { 'audio': audio });
    }
    this.setState({
      ayahDetails: details,
      mainResult: res,
      preloader: false,
      versesNowShowing: verseShowing
    }, () => (console.log(this.state.versesNowShowing)));

    return true;
  }

  // -- update the user input 
  updateInputVal(evt) {
    let value = evt.target.value;
    let isValid = this.validateInput(value);
    let navBackClass = this.state.navBtnClass.back;
    let navNextClass = this.state.navBtnClass.next;
    let searchBtn;

    if (isValid) {
      this.setState({
        inputVal: evt.target.value
      });
    }

    if (!Number(value)) {
      searchBtn = 'search-btn inactive';
    } else {
      searchBtn = 'search-btn';
    }
    if (value <= 1) {
      navNextClass = 'nav-btn next';
      navBackClass = 'nav-btn back disabled';
    } else {
      navBackClass = 'nav-btn back';
      if (this.state.selSurahNumber > 0 && value === this.state.selectedSurah.numberOfAyahs) {
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

  // -- verify key pressed in ayah input field
  verifyInputKey(evt) {
    //console.log('asdf');
    if (evt.keyCode === 186) {
      this.setState({
        selSurahNumber: evt.target.value,
        inputVal: ''
      }, () => this.fetchSurahDetails(Number(this.state.selSurahNumber)));
    }
  }

  // --- select surah from popup 
  selectSurah = (evt) => {
    //console.log(evt.target.value || evt.target.getAttribute('data-value'));
    let dataVal = evt.target.value || evt.target.getAttribute('data-value');
    this.getSurahDetails(dataVal);
  }

  // -- get surah details initiate 
  getSurahDetails(dataVal) {
    if (dataVal > 0 && dataVal <= 114) {
      this.setState({
        preloader: true,
        selSurahNumber: dataVal,
        selectedSurah: this.fetchSurahDetails(Number(dataVal))
      }, () => this.getAyahFromUrl());
    } else {
      console.log('Error: Surah Number Invalid!');
    }

  }

  // --- get ayah input from url string
  getAyahFromUrl() {
    console.log(this.state.selectedSurah);
    let totAyahsInSurah = this.state.selectedSurah.numberOfAyahs;
    let search_string = this.state.url_search;

    //if(search_string.split(':')[1] && Number(search_string.split(':')[1])){
    //console.log(this.state.selectedSurah);

    console.log(search_string);

    let ayah = undefined;
    // if (search_string){
    if (search_string.split(':').length >= 2 && Number(search_string.split(':')[1])) {
      console.log(Number('') ? true : false);
      if (this.validateInput(search_string.split(':')[1])) {
        ayah = search_string.split(':')[1];
        this.setState({
          // selSurahNumber: sur,
          preloader: true,
          inputVal: ayah,
        }, () => this.searchForAyah());
      } else {
        this.setState({
          // selSurahNumber: sur,
          preloader: false
        });
        console.log('Error: Ayah Number Invalid!');
      }
    } else {
      console.log('Error: Ayah Number Invalid or not found!');
    }
    // else -  no search_string in url
    if (!ayah || ayah === undefined) {
      this.setState({
        ayahDetails: {},
        mainResult: [],
        preloader: false
      }, () => this.ayahInput.focus());
    }

  }

  // fetch surah details from api
  fetchSurahDetails(dataVal) {
    let selSurah = undefined; // [];
    // let temp;
    if (this.state.surahList && this.state.surahList.length) {
      selSurah = this.state.surahList.filter(surah => Number(surah.number) === Number(dataVal))[0];
      // selSurah = temp[0];
      /* this.setState({
        selectedSurah: selSurah[0],
        selSurahNumber: selSurah[0].number
      }, () => {console.log(this.state.selectedSurah)});*/
    } else {
      console.log('Error: Surah List not available!');
    }

    // console.log(this.state.selectedSurah);


    return selSurah;

  }

  // get the language name n details from Langs.json
  findLang = (array, title) => {
    let result = array.filter(item => item.code === title);
    if (result.length) {
      return result[0];
    } else {
      return false;
    }
  }

  // navigate to next & previsous ayahs 
  navigateAyah = (evt) => {
    let data = evt.target.getAttribute('data-value');
    let valNow = Number(this.state.inputVal);
    let totAyahs = Number(this.state.selectedSurah.numberOfAyahs);
    let navBackClass = this.state.navBtnClass.back;
    let navNextClass = this.state.navBtnClass.next;
    switch (data) {
      case "back":
        if (valNow > 1) {
          valNow--;
        }
        break;
      case "next":
        if (valNow < totAyahs) {
          valNow++;
        }
        break;

      default:
    }
    if (valNow === 1) {
      navNextClass = 'nav-btn next';
      navBackClass = 'nav-btn back disabled';
    } else {
      navBackClass = 'nav-btn back';
      if (this.state.selSurahNumber > 0 && valNow === this.state.selectedSurah.numberOfAyahs) {
        navNextClass = 'nav-btn next disabled';
      } else {
        navNextClass = 'nav-btn next';
      }
    }
    this.setState({
      inputVal: String(valNow),
      navBtnClass: { back: navBackClass, next: navNextClass }
    }, () => this.searchForAyah(evt));

  }

  render() {
    let listview;
    // url is 'https://www.example.com/user?id=123&type=4';

    /*let default_trans = trans_conf.filter(item => item.active === '1');

    if(default_trans.length){

    }*/

    if (this.state.mainResult.length) {
      listview = <Listview
        key={this.state.ayahDetails && this.state.number}
        results={this.state.mainResult}
        details={this.state.ayahDetails}
        />
    }
    const surahs = this.state.surahList;
    const selectedSurah = this.state.selectedSurah;
    let share_url = '';
    if (selectedSurah && this.state.inputVal) {
      share_url = this.state.url_origin + '?' + selectedSurah.number + ':' + this.state.inputVal;
      console.log(share_url);
    }
    const SharePopup = () => (
      <Popup
        trigger={<button value="Share" className="share-button">Share</button>}
        on="click"
        position="center center"
        modal
        closeOnEscape
        closeOnDocumentClick
        className="surah-popup"
        onRequestClose={() => {
          this.setState({ modalIsOpen: false });
        } }
        >
        <div className="popup-wrapper">
          <h3>Share this Ayah ({this.state.selSurahNumber}: {this.state.inputVal}) </h3>
          <div className="share-content-wrapper">
            <label htmlFor="share-message" >Message (optional) </label>
            <textarea placeholder="Enter message, if any" rows="4" cols="38" className="share-msg" maxLength="120" autofocus="autofocus" />
            <div className="row-flex share-actions">
              <p>Share this Ayah using: </p>
              <WhatsappShareButton
                title="Q-search - Check out this Ayah"
                url={share_url}
                seperator="<br />"
                className="social-btn"
                children=<WhatsappIcon size={30} round={false}/>
                  />
             
                  <EmailShareButton
                    subject="Q-search - Check out this Ayah"
                    body="body text goes here"
                    url={share_url}
                    seperator="^"
                    openWindow="true"
                    className="social-btn"
                    children=<EmailIcon size={30} round={false}/>
                      />
            </div>
            </div>
          </div>
      </Popup>
        )

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
          } }
          >
          <div className="popup-wrapper">
            <h3>Select Surah: </h3>
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


        return (
        <div className="page-wrapper">
          <header className="App-header">
            <h1 onClick={this.resetView}>
              Q-Search
            </h1>
            {
              /*(share_url !== '') &&
              <SharePopup />*/
            }
          </header>
          {
            selectedSurah.number &&

            <SurahInfo
              details={this.state.ayahDetails}
              onNavNext={this.navigateAyah}
              onNavBack ={this.navigateAyah}
              selectedSurah ={selectedSurah}
              totalAyahs = {this.state.totalQuranAyahs}
              navBackClass = {this.state.navBtnClass.back}
              navNextClass = {this.state.navBtnClass.next}
              inputVal = {this.state.inputVal}
              refreshData = {this.processData}
              selectedTrans = {this.state.defaultTrans}
              selectTrans = {this.selectTranslation}
              />
          }
          {
            !selectedSurah.number &&
            <div className="surahlist-container">
              <h3>Surah Index</h3>
              <ul className="surah-list-ul">
                <li className="row-flex list-heads">
                  <p className="sayah">Ayahs</p>
                  <p className="sname">Surah Name</p>
                  <p className="sno" >No.</p>
                </li>
                {
                  surahs.map(surah => <li  key={surah.number} value={surah.number} className="row-flex" onClick={this.selectSurah}>

                    <span data-value={surah.number} className="sayah">{surah.numberOfAyahs}</span>
                    <div className="surahname-wrapper">
                      <p data-value={surah.number} className="sname-ar">{surah.name}</p>
                      <p data-value={surah.number} className="sname"><span className="blue-text">{surah.englishNameTranslation}</span> | {surah.englishName}</p>
                      <p data-value={surah.number} className="sname lighter">Tap to select this Surah</p>
                    </div>
                    <span data-value={surah.number} className="sno">{surah.number}</span>


                  </li>)
                }
              </ul>
            </div>
          }
          <section className={this.state.searchBlockClass} id="search-block">
            <div className="row-flex ayah-input-wrapper" >
              <div className="row-flex surah-select-wrapper" >
                <div className="help-bubble left bottom" onClick={(evt) => this.closeBubble} hidden >
                  <p>Tap to select Surah here.</p>
                </div>
                <SurahPopup />

                {this.state.selSurahNumber > 0 &&
                  <p ref={(sur) => { this.surahLabel = sur; } } className="surah-name">{this.state.selSurahNumber}: </p>
                }
              </div>
              <div className="ayah-input">
                <label hidden>Ayah Number: </label>
                <input type="number"
                  value={this.state.inputVal}
                  onChange={evt => this.updateInputVal(evt) }
                  onKeyDown={evt => this.verifyInputKey(evt) }
                  placeholder="Ayah No."
                  ref={(input) => { this.ayahInput = input; } }
                  className="input-ayah"
                  pattern="^[0-9]*$"
                  min="1"
                  max={this.state.selectedSurah.numberOfAyahs}
                  />

                <label ref={(sur) => { this.surahLabel = sur; } } className="ayah-total">of {this.state.selectedSurah.numberOfAyahs ? this.state.selectedSurah.numberOfAyahs : 6236 }</label>

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
