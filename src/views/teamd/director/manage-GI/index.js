import React from 'react';
import { Box, Container, Card } from '@material-ui/core';
import Page from 'src/components/Page';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddLineResearchView from './addLineResearch';
import AddKnowLedgeView from './addKnowLedge';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function options(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tab-${index}`
  };
}

const useStyles = makeStyles(()=> ({
  appbar: {
    marginLeft: '10px',
    marginRight: '10px',
    width: '100vh',
    boxShadow: 'none'
  },
  contenedor: {
    borderRadiusLeft: '10px',
    boxShadow: '0 5px 2px -2px gray',
    background: 'none',
    marginLeft: '10px'
  }
}));

const ManageView = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Page title="Manage Places">
      <Container maxWidth={false}>
        <Box mt={3}>
          <Card>
            <AppBar
              className={classes.appbar}
              color="transparent"
              position="relative"
            >
              <Tabs
                textColor="primary"
                indicatorColor="secondary"
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="on"
              >
                <Tab label="Agregar miembros" {...options(0)} />
                <Tab label="Consultar miembros" {...options(1)} />
                <Tab label="Agregar area de conocimiento" {...options(2)} />
                <Tab label="Agregar linea de investigacion" {...options(3)} />
              </Tabs>
            </AppBar>

            <TabPanel value={value} index={0}>
              <div>TODO</div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div>TODO</div>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <AddKnowLedgeView />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <AddLineResearchView />
            </TabPanel>
          </Card>
        </Box>
      </Container>
    </Page>
  );
};

export default ManageView;
