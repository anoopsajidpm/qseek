
import React from 'react';
//import logo from './logo.svg';
import './App.scss';
import 'typeface-roboto';
import TextField from '@material-ui/core/TextField';

//import PropTypes from 'prop-types';
//import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
//import Tabs from '@material-ui/core/Tabs';
//import Tab from '@material-ui/core/Tab';

import Listview from './components/Listview/Listview';

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        mainResult: [],
        inputVal: '',
        ayahDetails: {},
        rowResult: {}
      }
    }
    
    
    onClick = (event) => {
      
      const filter = this.state.inputVal;
      
      fetch('http://api.alquran.cloud/v1/ayah/' + filter + '/editions/quran-uthmani,en.asad,en.pickthall,ml.abdulhameed,ar.alafasy')
      .then(res => res.json())
      .then((data) => {
        //console.log(data)
        //this.setState({rowResult :data});
        //this.setState({ mainResult: this.processData(data)});
        this.processData(data)
        
      })
      .catch(console.log)
    }
    
    //processData = (result) => {
     processData(result) {
      //console.log(data);
      let res = [];
      let audio = '';
      let details = null;
      result.data.map(item => {
          let filteredItem = null;
          if(!item.audio){
            filteredItem = {'edition': item.edition, 'text': item.text};
            res.push(filteredItem);
          }
          else{
            if(audio === ''){
              audio = item.audio;
            }
          }
          if(!details){
            //details = item.surah;
            details = Object.assign(item.surah, {
              'hizbQuarter': item.hizbQuarter,
              'juz': item.juz,  
              'manzil': item.manzil,
              'number': item.number,
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
      console.log(res);
      console.log(details);
      this.setState({ ayahDetails: details});
      this.setState({ mainResult: res});
      
    }
    
    updateInputVal = (evt) => {
      this.setState({
        inputVal: evt.target.value
      });
    }
    
  

  render(){
    
    
    let listview;
    if(this.state.mainResult.length){
      
      listview = <Listview results={this.state.mainResult} details={this.state.ayahDetails}/>
    }
  return (
    <div>
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
        <section className='row-flex'>
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
          <Button onClick={this.onClick} size='small' variant='contained' fullWidth={false}>
            Search
          </Button>
          {listview}
        </section>
      </div>
      
      
           
    </div>
  );
  }
}

export default App;
