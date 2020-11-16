import React from 'react'

import {
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Container,
  makeStyles,
  Select,
  InputLabel,
  MenuItem,
  Grid
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

import changePeriod from 'src/redux/actions/changePeriods'

/*
 * nos permite conectar el componente para que pueda tener acceso
 * al estado de los reducers
 */
import { connect } from 'react-redux'

const useStyles = makeStyles(() => ({
  root: {},
  Container: {
    height: 100
  },
  SearchBar: {
    paddingTop: 0,
    paddingBottom: 2,
    height: 90
  },
  Select: {
    alignItems: 'center'
  }
}))

const SearchBar = ({ className, context, periods, status, programs, changePeriod, ...rest }) => {
  const classes = useStyles()

  const handleChange = e => {
    let period = e.target.value
    let va = changePeriod(period)
    console.log(va)

  }
  return (
    <Container className={classes.Container}>
      <Box mt={2}>
        <Card className={classes.SearchBar}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item lg={5} md={5} xs={12}>
                <Box maxWidth={500}>
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon fontSize="small" color="action">
                            <SearchIcon />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder={
                      context == 'activities'
                        ? 'Buscar actividad ...'
                        : context == 'students'
                        ? 'Buscar estudiante ...'
                        : 'Buscar Evaluación ...'
                    }
                    variant="outlined"
                  />
                </Box>
              </Grid>
              {periods == undefined ? (
                console.log('No period parameter filther')
              ) : (
                <Grid item lg={2} md={2} xs={12}>
                  <Box className={classes.Select}>
                    <InputLabel htmlFor="Select-cohorte">
                      Seleccionar periodo
                    </InputLabel>
                    <Select 
                    id="Select-cohorte"
                    value=""
                    onChange={handleChange}>
                      {periods.map(element => (
                        <MenuItem key={element} value={element}>
                          {' '}
                          {element}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Grid>
              )}
              {status == undefined ? (
                console.log('No status parameter filther')
              ) : (
                <Grid item lg={2} md={2} xs={12}>
                  <Box className={classes.Select}>
                    <InputLabel htmlFor="Select-cohorte">
                      Seleccionar Tipo
                    </InputLabel>
                    <Select id="Select-cohorte">
                      {status.map(element => (
                        <MenuItem key={element} value={element}>
                          {' '}
                          {element}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Grid>
              )}
              {programs == undefined ? (
                console.log('No programs parameter filther')
              ) : (
                <Grid item lg={2} md={2} xs={12}>
                  <Box className={classes.Select}>
                    <InputLabel htmlFor="Select-cohorte">
                      Seleccionar programa
                    </InputLabel>
                    <Select id="Select-cohorte">
                      {programs.map(element => (
                        <MenuItem key={element} value={element}>
                          {' '}
                          {element}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )

}

const mapDispatchToProps = dispatch => {
  return {
    changePeriod: period => dispatch(changePeriod(period))
  }
}

export default connect(null, mapDispatchToProps)(SearchBar)
