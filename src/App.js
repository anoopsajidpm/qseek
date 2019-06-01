
import React from 'react';
//import logo from './logo.svg';
import './App.scss';
import 'typeface-roboto';
import TextField from '@material-ui/core/TextField';

//import PropTypes from 'prop-types';
//import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Popover from '@material-ui/core/Popover';

import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
//import Tabs from '@material-ui/core/Tabs';
//import Tab from '@material-ui/core/Tab';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
//import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
//import CheckBoxIcon from '@material-ui/icons/CheckBox';
//import Favorite from '@material-ui/icons/Favorite';
//import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import Listview from './components/Listview/Listview';


class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        mainResult: [],
        inputVal: '',
        ayahDetails: {},
        rawData: {},
        searchError: false,
        searchBlockClass: 'search-wrapper',
        chkTrans: {'english': false, 'malayalam' : false}
      }
    }
    
    
    onClick = (event) => {
      
      const filter = this.state.inputVal;
      
      fetch('http://api.alquran.cloud/v1/ayah/' + filter + '/editions/quran-simple-enhanced,en.asad,en.pickthall,ml.abdulhameed,ar.alafasy')
      .then(res => res.json())
      .then((data) => {
        //console.log(data)
        this.state.searchError = false;
        this.setState({rawData :data});
        this.state.searchBlockClass='search-wrapper shrink';
        //this.setState({ mainResult: this.processData(data)});
        this.processData(data);
        
        
      })
      .catch(console.log)
    }
    
     processData(result) {
      let res = [];
      let audio = '';
      let details = null;
      
      this.setState({ 
        ayahDetails: {},
        mainResult: []
      });
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
            }
            //console.log(flag);
            //console.log(this.state.chkTrans.english);
            //console.log(this.state.chkTrans.malayalam);
            if(flag){
              //console.log('true----');
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
        }
      )
      if(audio){
        details = Object.assign(details, {'audio': audio});
      }
      //console.log(res);
      //console.log(details);
      this.setState({ ayahDetails: details});
      this.setState({ mainResult: res});
      
    }
    
    updateInputVal = (evt) => {
      this.setState({
        inputVal: evt.target.value
      });
    }
    
  chkSelectChange = (evt) => {
    switch(evt.target.value){
       case "eng":
        this.state.chkTrans.english = !this.state.chkTrans.english;
        break;
       case "mlm":
        this.state.chkTrans.malayalam = !this.state.chkTrans.malayalam;
        break;
    }
    if(this.state.rawData.status && this.state.rawData.status === 'OK'){
      this.processData(this.state.rawData);
    }
  }

  render(){
    /* <Button onClick={this.onClick} size='medium' variant='contained' fullWidth={false}>
            Search
          </Button> */
    let listview;
    if(this.state.mainResult.length){
      listview = <Listview results={this.state.mainResult} details={this.state.ayahDetails}/>
    } else {
      if(this.state.searchError) {
        listview = <p className='error-txt'>The Referrence entered is Invalid</p>
      }
    }
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
        
          <TextField
            id="standard-error"
            label="Enter your search reference (E.g. 2.263)"
            placeholder="Enter search"
            defaultValue={this.state.inputVal}
            margin="normal"
            autoFocus={true}
            onChange={evt =>this.updateInputVal(evt)}
            fullWidth={true}
          />
          
         
          <FormGroup row>
          
            <p><strong>Trans: &nbsp;</strong></p>
            <FormControlLabel
              value="eng"
              control={<Checkbox color="primary" />}
              label="English"
              labelPlacement="end"
              checked={this.state.chkTrans.english}
              onChange={evt => this.chkSelectChange(evt)}
            />
            <FormControlLabel
              value="mlm"
              control={<Checkbox color="primary" />}
              label="Malayalam"
              labelPlacement="end"
              checked={this.state.chkTrans.malayalam}
              onChange={evt => this.chkSelectChange(evt)}
              
            />
            <button onClick={this.onClick} value="Search" >Search</button>
          </FormGroup>
        </section>
        {listview}
      </div>
      
      
           
    </div>
  );
  }
}
//onChange={handleChange('checkedF')}
export default App;
