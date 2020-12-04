import React, { useEffect, useState } from 'react';
import {
  Card, Grid, TextField, makeStyles, Container, Typography, Divider
} from '@material-ui/core';

import BreadCrumbs from 'src/views/teamb/activitiesView/components/BreadCrumbs';
import PDFUpload from 'src/views/teamb/activitiesView/components/UploadPDF';
import FormOption from 'src/views/teamb/activitiesView/components/FormOption';
import ConfirmOption from 'src/views/teamb/activitiesView/components/ConfirmOption';
import Response from 'src/views/teamb/activitiesView/components/Response';
import SelectField from 'src/views/teamb/activitiesView/components/SelectField';

import service from '../services/service';
import util from '../services/util';

const objService = new service();
const objUtil = new util();

const useStyles = makeStyles(() => ({
  root: {
    margin: '10px'
  },
  container: {
    display: 'flex',
    justifyContent: 'center'
  },
  card: {
    maxWidth: '50%',
    margin: '10px'
  },
  title: {
    margin: '20px'
  },
  content: {
    marginBottom: '16px',
    marginLeft: '16px',
    marginRight: '16px'
  },
  field: {
    marginTop: '18px'
  },
  validator: {
    color: 'red',
    fontSize: 13
  }
}));

const ActivityFiveView = () => {
  const classes = useStyles();
  // Estado que controla los valores del formulario
  const [values, setValues] = useState({
    proposito: '',
    descripcion: '',
    ciudadSeleccionada: 0,
    institucionSeleccionada: 0,
    nombreResponsable: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const [archivo, setArchivo] = useState(null);
  const uploadFile = e => {
    setArchivo(e);
    if (e.length > 0) { 
      var name = e[0].name;
      var nameSplit = name.split(".");
      var ext = nameSplit[nameSplit.length - 1];
      
      if (ext === "pdf") { document.getElementById("text-file").textContent = e[0].name; }
      else { alert("Error al cargar el archivo\nSolo es posible subir archivos con extensión .pdf"); }
    }
    else { document.getElementById("text-file").textContent = ""; }
  }
  // Costantes para definir el estado de la ventana emergente de confirmación cuando se pulsa sobre una de las 
  // opciones disponibles
  const [emergenteCancelar, setEmergenteCancelar] = React.useState(false);
  const [emergenteGuardar, setEmergenteGuardar] = React.useState(false);
  const [emergenteGuardarYEnviar, setEmergenteGuardarYEnviar] = React.useState(false);

  // Se modificó "handleClose" para que despliegue la ventana emergente
  const handleClose = () => {
    setEmergenteCancelar(true);
  };
  // "handleNo" controla cuando se da click en el botón "NO" de la ventana emergente
  const handleCancelarNo = () => {
    setEmergenteCancelar(false);
  };

  // "handleGuardar" valida los datos y lanza la ventana emergente
  const handleGuardar = () => {
    if (validarGuardar()) { setEmergenteGuardar(true); }
  };
  // "handleGuardarNo" controla cuando se da click en el botón "NO" de la ventana emergente
  const handleGuardarNo = () => {
    setEmergenteGuardar(false);
  };

  // Valida los datos y lanza la ventana emergente
  const handleGuardarYEnviar = () => {
    if (validarGuardarYEnviar()) { setEmergenteGuardarYEnviar(true); }
  };
  // Controla cuando se da click en el botón "NO" de la ventana emergente
  const handleGuardarYEnviarNo = () => {
    setEmergenteGuardarYEnviar(false);
  };

  const [errorProposito, setErrorProposito] = useState(null);
  const [errorDescripcion, setErrorDescripcion] = useState(null);
  //const [errorPais, setErrorPais] = useState(null);
  const [errorCiudad, setErrorCiudad] = useState(null);
  const [errorInstitucion, setErrorInstitucion] = useState(null);
  const [errorNombreResponsable, setErrorNombreResponsable] = useState(null);
  const [errorStartDate, setErrorStartDate] = useState(null);
  const [errorEndDate, setErrorEndDate] = useState(null);
  const [errorFile, setErrorFile] = useState(null);

  const  resetError = () => {
    setErrorProposito(null);
    setErrorDescripcion(null);
    setErrorCiudad(null);
    setErrorInstitucion(null);
    setErrorNombreResponsable(null);
    setErrorStartDate(null);
    setErrorEndDate(null);
    setErrorFile(null);
  }

   //"validar" permite verificar que todos los campos requeridos se encuentren diligenciados 
   const validarGuardarYEnviar = () => {
    resetError();
    var result = true;
    result = validarGuardar();

     
    if (values.fechaFin.length) {
      if (values.fechaInicio <= values.fechaFin) { setErrorEndDate("") }
      else {
        setErrorEndDate("La fecha de finalización de la estancia debe ser después de la fecha inicio de estancia")
        result = false;
      }
    }
    else {
    setErrorEndDate("Seleccióne una fecha fin de estancia válida")
    result = false;
    }
    var textFile = document.getElementById("text-file").textContent;
    if (textFile.length > 0) { setErrorFile(null) }
    else {
      setErrorFile("Es necesario subir el archivo");
      result = false;
    }
    return result
  }
  //"validar" permite verificar que todos los campos requeridos se encuentren diligenciados en guardar
  const validarGuardar = () => {
    resetError();
    var result = true;

    if(values.proposito !== ''){
      if (values.proposito.length < 101) { setErrorProposito(null) }
      else {
        setErrorProposito("El campo debe tener máximo 100 caracteres")
        result = false;
      }
    }
    else{
      setErrorProposito("El campo es obligatorio");
        result = false;
    }   
    if(values.descripcion !== ''){
      if (values.descripcion.length < 149) { setErrorDescripcion(null) }
      else {
        setErrorDescripcion("El campo debe tener máximo 148 caracteres")
        result = false;
      }
    }
    else {
      setErrorDescripcion("El campo es obligatorio")
      result = false;
    } 
    if (values.ciudadSeleccionada !== 0) { setErrorCiudad(null) }
    else {
      setErrorCiudad("Seleccione una opción válida");
      result = false;
    }
    if (values.institucionSeleccionada !== 0) { setErrorInstitucion(null) }
    else {
      setErrorInstitucion("Seleccione una opción válida");
      result = false;
    }
    if(values.nombreResponsable !== ''){
      if (values.nombreResponsable.length < 61) { setErrorNombreResponsable(null) }
      else {
        setErrorNombreResponsable("El campo debe tener máximo 60 caracteres")
        result = false;
      }
    }
    else{
      setErrorNombreResponsable("El campo es obligatorio");
        result = false;
    } 
    if (values.fechaInicio.length) {
      setErrorStartDate("") 
    }
    else {
      setErrorStartDate("Seleccióne una fecha inicio de estancia válida")
      result = false;
    }
      
    if (values.fechaFin !== '') {
      if (values.fechaInicio <= values.fechaFin) { setErrorEndDate("") }
      else {
        setErrorEndDate("La fecha de finalización debe ser después de la fecha de inicio")
        result = false;
      }
    }
    
    return result
  }
  // Costante para definir el estado de la ventana emergente que muestra el resultado de enviar los datos del 
  // formulario al backend
  const [popUpRequestPost, setPopUpRequestPost] = React.useState(false);

  // Costante para definir el mensaje de la ventana emergente que muestra el resultado de enviar los datos del 
  // formulario al backend
  const [response, setResponse] = useState(null);

  const handleResponseAccept = () => {
    if (response === "Actividad registrada correctamente") {
      window.location.href = window.location.href;
    }
    setPopUpRequestPost(false);
    setResponse(null);
  };

  const handleBack = () => {
    window.location.href = './';
  };

  const [currentAcadYear, setCurrentAcadYear] = useState(null);
  useEffect(() => {
    /* Dato quemado desde la tabla User: id_user */
    objService.GetPeriodService(8).then((result) => {
      var CurrentPeriod = result.data.period;
      var CurrentAcadYear = objUtil.GetCurrentYear(CurrentPeriod);
      setCurrentAcadYear(CurrentAcadYear);
    }).catch(() => {
      alert("Error, no hay registros para mostrar");
    });
  }, []);

  const SaveActivity = () => {
    var now = objUtil.GetCurretTimeDate();
    //Se captura el valor booleano de "emergenteGuardarYEnviar" y se envía en el 
    //documento JSON con el fin de saber si se debe enviar el email a quien corresponda
    var send_email = emergenteGuardarYEnviar;

    const fd = new FormData();
    fd.append("description", values.descripcion);
    fd.append("start_date", values.fechaInicio);
    fd.append("end_date", values.fechaFin);
    fd.append("purpose", values.proposito);
    fd.append("responsible", values.nombreResponsable);
    fd.append("city", values.ciudadSeleccionada);
    //fd.append("country", values.paisSeleccionado);
    fd.append("institution", values.institucionSeleccionada);
    // Datos adicionales
    fd.append("academic_year", currentAcadYear);
    fd.append("type", 5);
    fd.append("student", 36); // Consultar el id del estudiante actual
    fd.append("date_record", now);
    fd.append("date_update", now);
    //fd.append("is_active", true);
    if (send_email) {
      fd.append("send_email", send_email);
      fd.append("state", 2);
    }
    else { fd.append("state", 1); }
    if (archivo !== null) { fd.append("receipt", archivo[0]); }

    objService.PostActivityFive(fd).then((result) => {
      setResponse("Actividad registrada correctamente");
    }).catch(() => {
      setResponse("Ups! Ha ocurrido un error al registrar la actividad, intentelo mas tarde o contacte con el administrador");
    });
    setPopUpRequestPost(true);
    setEmergenteGuardar(false);
    setEmergenteGuardarYEnviar(false);
  }
  
  return (
    <Grid className={classes.root}>
      <BreadCrumbs />
      <Container className={classes.container}>
        <Card className={classes.card}>
          <Grid className={classes.content}>
            <Typography className={classes.title} variant="h1" align="center" gutterBottom>
              Estancias de investigación en otras instituciones
            </Typography>
            <Divider />
            <form>
              <TextField className={classes.field} fullWidth label="Proposito general de la estancia" name="proposito" 
                onChange={handleChange} required variant="outlined"
              />
              {/* Validacion del campo */}
              {errorProposito ? <Typography className={classes.validator}> {errorProposito} </Typography> : null}

              <TextField className={classes.field} fullWidth label="Descripcion de las actividades desarrolladas" 
                name="descripcion" onChange={handleChange} required variant="outlined" 
              />
              {/* Validacion del campo */}
              {errorDescripcion ? <Typography className={classes.validator}> {errorDescripcion} </Typography> : null}
              {/*
              <SelectField name="paisSeleccionado" label="Pais" handleChange={handleChange} />
               Validacion del campo 
              {errorPais ? <Typography className={classes.validator}> {errorPais} </Typography> : null}
              */}
              <SelectField name="ciudadSeleccionada" Selected={values.ciudadSeleccionada} label="Ciudad" handleChange={handleChange} />
              {/* Validacion del campo */}
              {errorCiudad ? <Typography className={classes.validator}> {errorCiudad} </Typography> : null}
              
              <SelectField name="institucionSeleccionada" Selected={values.institucionSeleccionada} label="Institución" handleChange={handleChange} />
              {/* Validacion del campo */}
              {errorInstitucion ? <Typography className={classes.validator}> {errorInstitucion} </Typography> : null}
              
              {/*justify="space-evenly"*/}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField fullWidth className={classes.field} name="fechaInicio" label="Fecha de inicio" type="date"
                    InputLabelProps={{ shrink: true }} onChange={handleChange} variant="outlined" required
                  />
                  {/* Validacion del campo */}
                  {errorStartDate ? <Typography className={classes.validator}> {errorStartDate} </Typography> : null}
                </Grid>
                <Grid item xs={6}>
                  {values.fechaFin == null ? values.fechaFin = '' : null}
                  <TextField fullWidth className={classes.field} name="fechaFin" label="Fecha de finalización" type="date"
                    InputLabelProps={{ shrink: true }} onChange={handleChange} variant="outlined"
                  />
                  {/* Validacion del campo */}
                  {errorEndDate ? <Typography className={classes.validator}> {errorEndDate} </Typography> : null}
                </Grid>
              </Grid>

              <TextField className={classes.field} fullWidth label="Nombre del responsable" name="nombreResponsable" 
                onChange={handleChange} required variant="outlined" 
              />
              {/* Validacion del campo */}
              {errorNombreResponsable ? <Typography className={classes.validator}> {errorNombreResponsable} </Typography> : null}

              <PDFUpload uploadFile={uploadFile} name="Justificante" />
              {errorFile ? <Typography className={classes.validator}> {errorFile} </Typography> : null}
            </form>
            <Divider className={classes.field} />
            <Grid container justify="flex-end">
              <FormOption name={"Cancelar"} onClick={handleClose} variant={"outlined"} />
              <FormOption name={"Guardar"} onClick={handleGuardar} variant={"contained"} />
              <FormOption name={"Guardar y Enviar"} onClick={handleGuardarYEnviar} variant={"contained"} />
            </Grid>
          </Grid>
        </Card>

        {/* Muestra un mensaje de confirmacion para cada una de las opciones del formulario */}
        <ConfirmOption open={emergenteCancelar} onClose={handleCancelarNo} onClickPositive={handleBack}
          msg={'¿Esta seguro de que desea salir del registro?'}
        />
        <ConfirmOption open={emergenteGuardar} onClose={handleGuardarNo} onClickPositive={SaveActivity}
          msg={'¿Esta seguro de que desea guardar la actividad?'}
        />
        <ConfirmOption open={emergenteGuardarYEnviar} onClose={handleGuardarYEnviarNo} onClickPositive={SaveActivity}
          msg={'¿Esta seguro de que desea guardar la actividad y enviar un correo a sus directores?'}
        />

        {/* Muestra la respuesta del servidor cuando se realiza la peticion */}
        <Response popUpRequestPost={popUpRequestPost} handleResponseAccept={handleResponseAccept} response={response} />

      </Container>
    </Grid>
  );
};
export default ActivityFiveView;
