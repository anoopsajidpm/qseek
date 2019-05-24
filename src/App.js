
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

/*function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}*/

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        mainResult: [],
        inputVal: ''
      }
    }
    onClick = (event) => {
      
      const filter = this.state.inputVal;
      
      fetch('http://api.alquran.cloud/v1/ayah/' + filter + '/editions/quran-uthmani,en.asad,en.pickthall,ar.alafasy')
      .then(res => res.json())
      .then((data) => {
        console.log(data)
        this.setState({ mainResult: data.data})
      })
      .catch(console.log)
    }
    updateInputVal = (evt) => {
      this.setState({
        inputVal: evt.target.value
      });
    }
    
  

  render(){
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
          <Button onClick={this.onClick} size='small' variant='raised' fullWidth={false}>
            Search
          </Button>
          
        </section>
      </div>
      <Listview results={this.state.mainResult} />
           
    </div>
  );
  }
}

export default App;
