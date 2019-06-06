
import React from 'react';
//import logo from './logo.svg';
import './App.scss';
import 'typeface-roboto';
//import TextField from '@material-ui/core/TextField';

//import PropTypes from 'prop-types';
//import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
//import Popover from '@material-ui/core/Popover';

import Typography from '@material-ui/core/Typography';

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
import Langs from './langs.json';
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
        preloader: true,
        chkTrans: {'english': false, 'malayalam' : false}
      }
      //const langs = JSON.parse('./langs.json');
      this.handleLoad = this.handleLoad.bind(this);
      this.chkSelectChange = this.chkSelectChange.bind(this);
      
    }
    
    componentDidMount() {
      //console.log(this.langs);
      window.addEventListener('load', this.handleLoad);
      //this.getLangs();
    }
    
    
    handleLoad(){
      this.setState({
         preloader: true
      });
      fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then((data) => {
        let sList = [];
        sList = data.data.map(chapter => {
          return chapter;
        });
        //this.surahList = sList;
        this.setState({
          surahList: sList,
          preloader: false
        });
        //console.log(this.state.surahList);
      })
      .catch(
        this.setState({
          preloader: false,
          searchError: this.getErrMessage('list')
        })
      )
    }
    
    searchForAyah() {
      let filter = this.state.inputVal;
      /*if(this.state.selectedSurah && this.state.selectedSurah.number){
        filter = this.state.selectedSurah.number + ":" + filter;
      }*/
      fetch('https://api.alquran.cloud/v1/ayah/' + filter + '/editions/quran-simple-enhanced,en.asad,en.pickthall,ml.abdulhameed,ar.alafasy')
        .then(res => res.json())
        .then((data) => {
          this.setState({
            searchError:'',
            rawData :data,
            searchBlockClass:'search-wrapper shrink'
          });
          console.log(data);
          this.processData(data);
          
        })
        .catch(
          this.setState({
           preloader: false,
           searchError: 'err'
          })
        )
    }
    onClick = (event) => {
      this.setState({
         preloader: true
      });
      let filter = this.state.inputVal;
      if(filter.split(':').length <= 1){
        if(this.state.selectedSurah.number){
          filter = this.state.selectedSurah.number + ":" + filter;
        }
      }
      
      if(filter){
      /*if(this.state.selectedSurah && this.state.selectedSurah.number){
        filter = this.state.selectedSurah.number + ":" + filter;
      }*/
        fetch('https://api.alquran.cloud/v1/ayah/' + filter + '/editions/quran-simple-enhanced,en.asad,en.pickthall,ml.abdulhameed,ar.alafasy')
          .then(res => res.json())
          .then((data) => {
            this.setState({
              searchError:'',
              rawData :data,
              searchBlockClass:'search-wrapper shrink'
            });
            console.log(data);
            this.processData(data);
            
          })
          .catch(
            this.setState({
             preloader: false,
             searchError: 'err'
            })
          )
      } 
    }
    
    getErrMessage(src) {
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
      
    }
    
     processData(result) {
      let res = [];
      let audio = '';
      let details = null;
      
      this.setState({ 
        ayahDetails: {},
        mainResult: []
      });
      
      //console.log(this.state.chkTrans.english);
      //console.log(this.state.chkTrans.malayalam);
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
    
    updateInputVal = (evt) => {
      this.setState({
        inputVal: evt.target.value
      });
    }
    changeSurah = (evt) => {
      console.log(evt.target.value);
      let selSurah = [];
      this.setState({
        selectedSurah: null
      });
      if(evt.target.value > 0){
        selSurah = this.state.surahList.filter(surah => Number(surah.number) === Number(evt.target.value));
        
        this.setState({
          selectedSurah: selSurah[0]
        });
      }
      console.log(selSurah);
      
      this.setState({ 
        ayahDetails: {},
        mainResult: [],
        inputVal: 1
      }, () => {this.ayahInput.focus()});
      
      //this.ayahInput.focus();
     
    }
    chkSelectChange = evt => {
      let targ = evt.target;
      //let status; //this.state.chkTrans.malayalam;
      let eng = Boolean(this.state.chkTrans.english);
      let mal = Boolean(this.state.chkTrans.malayalam);
      console.log(evt.target.value);
      //console.log(evt.target.checked);
      
      
      
      switch(targ.value){
       case "english":
        //status = this.state.chkTrans.english;
        eng = !eng;
        this.setState({
          chkTrans: {english: eng, malayalam: mal}
        },() => {
          console.log(this.state.chkTrans.elglish);
          if(eng){
            targ.className = "toggle-btn selected";
          } else {
            targ.className = "toggle-btn";
          }
          
          if(this.state.rawData.status && this.state.rawData.status === 'OK'){
            this.processData(this.state.rawData);
          }
        });
        break;
       case "malayalam":
        //status = this.state.chkTrans.malayalam;
        mal = !mal;
        this.setState({
          chkTrans: {english: eng, malayalam: mal}
        },() => {
          console.log(this.state.chkTrans.malayalam);
          if(mal){
            targ.className = "toggle-btn selected";
          } else {
            targ.className = "toggle-btn";
          }
          if(this.state.rawData.status && this.state.rawData.status === 'OK'){
            this.processData(this.state.rawData);
          }
        });
        break;
       default:
      }
      
      
      
      
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
  render(){
    let listview;
    //console.log(this.langs);
    if(this.state.mainResult.length){
      listview = <Listview key={this.state.ayahDetails && this.state.number} results={this.state.mainResult} details={this.state.ayahDetails}/>
    }
    console.log(this.findLang(Langs, 'ml'));
    const surahs = this.state.surahList;
      
           
  return (
    <div className="page-wrapper">
      <header>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h1" size="small" color="inherit">
              Q-Search
            </Typography>
          </Toolbar>
        </AppBar>
      </header>
      
      <div className='content-wrapper'>
        <section className={this.state.searchBlockClass} id="search-block">
        <div className="row-flex ayah-input-wrapper" >
          <div className="col-flex">
            <label htmlFor="surah-list">Surah:</label>
            <select id="surah-list" onChange={evt => this.changeSurah(evt)} className="surah-select">
              <option value="0" >--Select--</option>
              { 
                this.state.surahList.map(el => <option value={el.number} key={el.number} > {el.number} - {el.englishName} </option>)
              }
            </select>
            {this.state.selectedSurah.englishName && 
              <label ref={(sur) => { this.surahLabel = sur; }} className="surah-name">{this.state.selectedSurah.englishName}</label>
            }
          </div>
          <div className="col-flex">
            <label htmlFor="ayah-input" >Ayah Number:</label>
            <input type="number"
              value={this.state.inputVal}
              onChange={evt =>this.updateInputVal(evt)}
              placeholder="Enter your search"
              ref={(input) => { this.ayahInput = input; }} 
              className="input-ayah"
            />
            {this.state.selectedSurah.englishName && 
              <label ref={(sur) => { this.surahLabel = sur; }} className="ayah-total">of {this.state.selectedSurah.numberOfAyahs}</label>
            }
          </div>
          <button type="submit" onClick={this.onClick} value="Search" className="search-btn">Search</button>
         </div> 
         <div className="trans-wrapper">
            <label>Translations: </label>
            <button className="toggle-btn" value="english" onClick={this.chkSelectChange}>Eng</button>
            <button className="toggle-btn" value="malayalam" onClick={this.chkSelectChange}>Mal</button>
            
          </div>
          
        </section>
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
