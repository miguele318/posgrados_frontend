import React, { useEffect, useState } from 'react';
import {
  Card, Grid, TextField, makeStyles, Container, Typography, Divider
} from '@material-ui/core';

import PDFUpload from 'src/views/teamb/activitiesView/components/UploadPDF';
import FormOption from 'src/views/teamb/activitiesView/components/FormOption';
import ConfirmOption from 'src/views/teamb/activitiesView/components/ConfirmOption';
import Response from 'src/views/teamb/activitiesView/components/Response';
import SelectField from 'src/views/teamb/activitiesView/components/SelectField';

import service from '../../services/service';
import util from '../../services/util';

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

export const ActivityOneEdit = ({ state, callbackDialogOpen }) => {
  const classes = useStyles();

  useEffect(() => {
    if(state.receipt !== null) {
      document.getElementById("text-file").textContent = "El archivo previamente registrado esta cargado";
    }
  }, []);

  // Estado que controla los valores del formulario
  const [values, setValues] = useState({
    id: state.id,
    titulo: state.title,
    descripcion: state.description,
    programaSeleccionado: state.program,
    horasAsignadas: state.assigned_hours,
    fechaInicio: state.start_date,
    fechaFin: state.end_date,
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

  // Costantes para controlar las validaciones del formulario
  const [errorTitle, setErrorTitle] = useState(null);
  const [errorDescription, setErrorDescription] = useState(null);
  const [errorProgram, setErrorProgram] = useState(null);
  const [errorHour, setErrorHour] = useState(null);
  const [errorStartDate, setErrorStartDate] = useState(null);
  const [errorEndDate, setErrorEndDate] = useState(null);
  const [errorFile, setErrorFile] = useState(null);

  const resetError = () => {
    setErrorTitle(null);
    setErrorDescription(null);
    setErrorProgram(null);
    setErrorHour(null);
    setErrorStartDate(null);
    setErrorEndDate(null);
    setErrorFile(null);
  }

  const validarGuardarYEnviar = () => {
    resetError();
    var result = validarGuardar();

    
    if (values.horasAsignadas > 0 && values.horasAsignadas !== "") {
      if( values.horasAsignadas < 10000) {setErrorHour(null) }
      else{
        setErrorHour("El numero de horas asignadas debe ser menor a 10000")
        result = false;
      }
    }
    else {
      setErrorHour("Seleccione un número de horas valido")
      result = false;
    }
    if(values.fechaFin != null){
      if (values.fechaFin.length) {
        if (values.fechaInicio <= values.fechaFin) { setErrorEndDate("") }
        else {
          setErrorEndDate("La fecha de finalización debe ser después de la fecha de inicio")
          result = false;
        }
      }
      else {
        setErrorEndDate("Seleccióne una fecha final válida")
        result = false;
      }
    }
    else {
      setErrorEndDate("Seleccióne una fecha final válida")
      result = false;
    }
    var textFile = document.getElementById("text-file").textContent;
    if (textFile.length > 0) { setErrorFile(null) }
    else {
      setErrorFile("Es necesario subir el archivo");
      result = false;
    }
    return result;
  }
  // Permite verificar que todos los campos requeridos se encuentren diligenciados al guardar
  const validarGuardar = () => {
    resetError();
    var result = true;

    if(values.titulo !== ''){
      if (values.titulo.length < 61) { setErrorTitle(null) }
      else {
        setErrorTitle("El campo debe tener máximo 60 carateres")
        result = false;
      }
    }
    else {
      setErrorTitle("El campo es obligatorio")
      result = false;
    }
    if(values.descripcion !== ''){
      if (values.descripcion.length < 149) { setErrorDescription(null) }
      else {
        setErrorDescription("El campo debe tener máximo 148 caracteres")
        result = false;
      }
    }
    else {
      setErrorDescription("El campo es obligatorio")
      result = false;
    }
    if (values.programaSeleccionado !== 0) { setErrorProgram(null) }
    else {
      setErrorProgram("Seleccione una opción válida")
      result = false;
    }
    if (values.horasAsignadas >= 0 && values.horasAsignadas !== "") {
      if( values.horasAsignadas < 10000) {setErrorHour(null) }
      else{
        setErrorHour("El numero de horas asignadas debe ser menor a 10000")
        result = false;
      }
    }
    else {
      setErrorHour("Seleccione un número de horas valido.(Mayor o igual a 0)")
      result = false;
    }
    if (values.fechaInicio.length) {setErrorStartDate("")}
    else {
      setErrorStartDate("Seleccióne una fecha inicial válida")
      result = false;
    }
    if(values.fechaFin != null){
      if (values.fechaFin.length) {
        if (values.fechaInicio <= values.fechaFin) { setErrorEndDate("") }
        else {
          setErrorEndDate("La fecha de finalización debe ser después de la fecha de inicio")
          result = false;
        }
      }
    }
    return result;
  }
  // Costante para definir el estado de la ventana emergente que muestra el resultado de enviar los datos del 
  // formulario al backend
  const [popUpRequestPost, setPopUpRequestPost] = React.useState(false);

  // Costante para definir el mensaje de la ventana emergente que muestra el resultado de enviar los datos del 
  // formulario al backend
  const [response, setResponse] = useState(null);

  const handleResponseAccept = () => {
    if (response === "Actividad editada correctamente") {
      window.location.href = window.location.href;
    }
    callbackDialogOpen(false);
    setPopUpRequestPost(false);
    setResponse(null);
  };

  const handleBack = () => {
    setEmergenteCancelar(false);
    callbackDialogOpen(false);
  };

  const SaveActivity = () => {
    var now = objUtil.GetCurretTimeDate();
    // /* Se captura el valor booleano de "emergenteGuardarYEnviar", para saber si se enviara en el
    // documento JSON, la validacion para el correo */
    var send_email = emergenteGuardarYEnviar;

    const fd = new FormData();
    fd.append("id", values.id);
    fd.append("title", values.titulo);
    fd.append("description", values.descripcion);
    fd.append("program", values.programaSeleccionado);
    fd.append("assigned_hours", values.horasAsignadas);
    fd.append("start_date", values.fechaInicio);
    if (values.fechaFin === null) { values.fechaFin = ''; }
    fd.append("end_date", values.fechaFin);
    fd.append("academic_year", state.academic_year);
    fd.append("student", 36); // Consultar el id del estudiante actual
    fd.append("date_record", state.date_record);
    fd.append("date_update", now);
    if (send_email) {
      fd.append("send_email", send_email);
      fd.append("state", 2);
    }
    if (archivo !== null) { fd.append("receipt", archivo[0]); }

    objService.PutActivityOneEdit(fd, values.id).then((request) => {
      setResponse("Actividad editada correctamente");
    }).catch(() => {
      setResponse("Ups! Ha ocurrido un error al editar la actividad, intentelo mas tarde o contacte con el administrador");
    });
    setPopUpRequestPost(true);
    setEmergenteGuardar(false);
    setEmergenteGuardarYEnviar(false);
  }

  return (
    <Container className={classes.container}>
      <Card className={classes.card}>
        <Grid className={classes.content}>
          <form>
            <TextField className={classes.field} fullWidth value={values.titulo} label="Titulo" name="titulo" onChange={handleChange}
              required variant="outlined"
            />
            {/* Validacion del campo */}
            {errorTitle ? <Typography className={classes.validator} > {errorTitle} </Typography> : null}

            <TextField className={classes.field} fullWidth value={values.descripcion} label="Descripcion general" name="descripcion"
              onChange={handleChange} required variant="outlined"
            />
            {/* Validacion del campo */}
            {errorDescription ? <Typography className={classes.validator}> {errorDescription} </Typography> : null}

            <SelectField name="programaSeleccionado" Selected={values.programaSeleccionado} label="Programa" handleChange={handleChange} />
            {/* Validacion del campo */}
            {errorProgram ? <Typography className={classes.validator}> {errorProgram} </Typography> : null}

            {/*justify="space-evenly"*/}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth className={classes.field} name="fechaInicio" value={values.fechaInicio} label="Fecha de inicio" type="date"
                  InputLabelProps={{ shrink: true }} onChange={handleChange} variant="outlined" required
                />
                {/* Validacion del campo */}
                {errorStartDate ? <Typography className={classes.validator}> {errorStartDate} </Typography> : null}
              </Grid>
              <Grid item xs={6}>
                {values.fechaFin == null ? values.fechaFin = '' : null}
                <TextField fullWidth className={classes.field} name="fechaFin" value={values.fechaFin} label="Fecha de fin" type="date"
                  InputLabelProps={{ shrink: true }} onChange={handleChange} variant="outlined"
                />
                {/* Validacion del campo */}
                {errorEndDate ? <Typography className={classes.validator}> {errorEndDate} </Typography> : null}
              </Grid>
            </Grid>

            <TextField className={classes.field} name="horasAsignadas" value={values.horasAsignadas} label="Nº de horas asignadas" type="number"
              onChange={handleChange} required variant="outlined"
            />
            {/* Validacion del campo */}
            {errorHour ? <Typography className={classes.validator}> {errorHour} </Typography> : null}

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
  );
};
export default ActivityOneEdit;