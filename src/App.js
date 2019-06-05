
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
      this.handleLoad = this.handleLoad.bind(this);
      this.chkSelectChange = this.chkSelectChange.bind(this);
    }
    
    componentDidMount() {
      window.addEventListener('load', this.handleLoad);
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
    onClick = (event) => {
      
      let filter = this.state.inputVal;
      this.setState({
         preloader: true
      });
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
        this.setState({
          preloader: false
        });
      })
      .catch(
        this.setState({
         preloader: false,
         searchError: 'err'
        })
      )
    }
    
    getErrMessage(src) {
      let message = '';
      let inp = this.state.inputVal;
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
      
      console.log(this.state.chkTrans.english);
      console.log(this.state.chkTrans.malayalam);
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
        this.setState({ ayahDetails: details, mainResult: res});
       
        
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
      let splitV = Array(2);
      
      splitV = this.state.inputVal.split(':');
      
      
      if(splitV.length > 1){
        splitV[0] = evt.target.value;
      } else {
        splitV[0] = evt.target.value;
        splitV.push("1");
      }
      //console.log(splitV);
      
      this.setState({
        inputVal: (splitV[0] + ":" + splitV[1])
      });
      selSurah = this.state.surahList.filter(surah => surah.number == evt.target.value);
      //console.log(selSurah);
      this.setState({
        selectedSurah: selSurah[0]
      });
      
      this.ayahInput.focus();
     
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

  render(){
    let listview;
    if(this.state.mainResult.length){
      listview = <Listview results={this.state.mainResult} details={this.state.ayahDetails}/>
    } /*else {
      if(this.state.searchError) {
        listview = <p className='error-txt'>The Referrence entered is Invalid</p>
      }
    }*/
    
      const surahs = this.state.surahList;
      const curSurah = this.state.selectedSurah;
      
           //console.log(this.state.selectedSurah);
           
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
        <div className="row-flex ayah-input-wrapper">
          <div className="col-flex">
            <label htmlFor="surah-list">Select Surah:</label>
            <select id="surah-list" onChange={evt => this.changeSurah(evt)} className="surah-select">
              <option value="0" >Select Surah</option>
              { 
                surahs.map(el => <option value={el.number} key={el.number} > {el.number} - {el.englishName} </option>)
              }
            </select>
            {this.state.selectedSurah.englishName && 
              <label ref={(sur) => { this.surahLabel = sur; }} className="surah-name">{this.state.selectedSurah.englishName}</label>
            }
          </div>
          <div className="col-flex">
          <label htmlFor="ayah-input" >Enter Ayah No:</label>
          <input type="text"
            value={this.state.inputVal}
            onChange={evt =>this.updateInputVal(evt)}
            placeholder="Enter ayah to search"
            ref={(input) => { this.ayahInput = input; }} 
            className="input-ayah"
            />
          </div>
          <button onClick={this.onClick} value="Search" className="search-btn">Search</button>
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
