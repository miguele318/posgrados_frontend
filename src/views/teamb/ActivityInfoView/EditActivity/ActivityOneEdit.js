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

export const ActivityOneEdit = ({state, callbackDialogOpen}) => {
  const classes = useStyles();
  // Estado que controla los valores del formulario
  const [values, setValues] = useState({
    id: state.id,
    titulo: state.title,
    descripcion: state.description,
    programaSeleccionado: state.program,
    horasAsignadas: state.assigned_hours,
    fechaInicio: state.start_date,
    fechaFin: state.end_date,
    //archivo: state.receipt,
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
    if (e.length > 0) { document.getElementById("text-file").textContent = e[0].name; }
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
    if (validar()) { setEmergenteGuardar(true); }
  };
  // "handleGuardarNo" controla cuando se da click en el botón "NO" de la ventana emergente
  const handleGuardarNo = () => {
    setEmergenteGuardar(false);
  };

  // Valida los datos y lanza la ventana emergente
  const handleGuardarYEnviar = () => {

    if (validar()) { setEmergenteGuardarYEnviar(true); }
  };
  // Controla cuando se da click en el botón "NO" de la ventana emergente
  const handleGuardarYEnviarNo = () => {
    setEmergenteGuardarYEnviar(false);
  };

  // Costantes para controlar las validaciones del formulario
  const [errorTitulo, setErrorTitulo] = useState(null);
  const [errorDescripcion, setErrorDescripcion] = useState(null);
  const [errorPrograma, setErrorPrograma] = useState(null);
  const [errorHoras, setErrorHoras] = useState(null);
  const [errorFechas, setErrorFechas] = useState(null);
  const [errorFile, setErrorFile] = useState(null);

  // Permite verificar que todos los campos requeridos se encuentren diligenciados 
  const validar = () => {
    var result = true;

    if (values.titulo.length) { setErrorTitulo(null) }
    else {
      setErrorTitulo("El campo es obligatorio")
      result = false;
    }
    if (values.descripcion.length) { setErrorDescripcion(null) }
    else {
      setErrorDescripcion("El campo es obligatorio")
      result = false;
    }
    if (values.programaSeleccionado != "") { setErrorPrograma(null) }
    else {
      setErrorPrograma("Seleccione una opción válida")
      result = false;
    }
    if (values.horasAsignadas.length && values.horasAsignadas > 0) { setErrorHoras(null) }
    else {
      setErrorHoras("Seleccione un número de horas valido")
      result = false;
    }
    if (values.fechaInicio.length && values.fechaFin.length) {
      if (values.fechaInicio <= values.fechaFin) { setErrorFechas("") }
      else {
        setErrorFechas("La fecha de finalización debe ser después de la fecha de inicio")
        result = false;
      }
    }
    else {
      setErrorFechas("Seleccióne una fecha inicial y una fecha final válidas")
      result = false;
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
    if (response == "Actividad registrada correctamente") {
      window.location.href = window.location.href;
    }
    callbackDialogOpen(false);
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
    objService.PutActivityOneEdit({
      title:values.titulo, 
      id: state.id, 
      description:values.descripcion,
      //receipt: archivo, 
      program:values.programaSeleccionado, 
      start_date:values.fechaInicio, 
      end_date:values.fechaFin,
      assigned_hours:values.horasAsignadas, 
      academic_year:state.academic_year,
      date_record:"2020-11-08T12:15:55-05:00",
      date_update:"2020-11-08T12:15:56-05:00",
      
      }).then((request)=> {
        setResponse("Actividad registrada correctamente");
      }).catch(()=>{
        setResponse("Ups! Ha ocurrido un error al registrar la actividad, intentelo mas tarde o contacte con el administrador");
      });
    // var now = objUtil.GetCurretTimeDate();
    // /* Se captura el valor booleano de "emergenteGuardarYEnviar", para saber si se enviara en el
    // documento JSON, la validacion para el correo */
    // var send_email = emergenteGuardarYEnviar;

    // const fd = new FormData();
    // fd.append("id", values.id);
    // fd.append("title", values.titulo);
    // fd.append("description", values.descripcion);
    // fd.append("program", values.programaSeleccionado);
    // fd.append("assigned_hours", values.horasAsignadas);
    // fd.append("start_date", values.fechaInicio);
    // fd.append("end_date", values.fechaFin);
    // // Datos adicionales
    // fd.append("academic_year", currentAcadYear);
    // fd.append("type", 1);
    // fd.append("student", 36); // Consultar el id del estudiante actual
    // fd.append("date_record", now);
    // fd.append("date_update", now);
    
    // //fd.append("is_active", true);
    // if (send_email) {
    //   fd.append("send_email", send_email);
    //   fd.append("state", 2);
    // }
    // else { fd.append("state", 1); }
    // if (archivo !== null) { fd.append("receipt", archivo[0]); }

    // objService.PutActivityOneEdit(fd).then((result) => {
    //   setResponse("Actividad registrada correctamente");
    // }).catch(() => {
    //   setResponse("Ups! Ha ocurrido un error al registrar la actividad, intentelo mas tarde o contacte con el administrador");
    // });
    setPopUpRequestPost(true);
    setEmergenteGuardar(false);
    setEmergenteGuardarYEnviar(false);
  }

  return (
    <Grid className={classes.root}>
      
      <Container >
        <Card >
          <Grid >
            
            <Divider />
            <form>
              <TextField className={classes.field} fullWidth value={values.titulo}  label="Titulo" name="titulo" onChange={handleChange}
                required variant="outlined"
              />
              {/* Validacion del campo */}
              {errorTitulo ? <Typography className={classes.validator} > {errorTitulo} </Typography> : null}

              <TextField className={classes.field} fullWidth value={values.descripcion} label="Descripcion general" name="descripcion"
                onChange={handleChange} required variant="outlined"
              />
              {/* Validacion del campo */}
              {errorDescripcion ? <Typography className={classes.validator}> {errorDescripcion} </Typography> : null}

              <SelectField name="programaSeleccionado"  Selected={values.programaSeleccionado} label="Programa" handleChange={handleChange} />
              {/* Validacion del campo */}
              {errorPrograma ? <Typography className={classes.validator}> {errorPrograma} </Typography> : null}

              {/*justify="space-evenly"*/}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField fullWidth className={classes.field}  name="fechaInicio" value={values.fechaInicio} label="Fecha de inicio" type="date"
                    InputLabelProps={{ shrink: true }} onChange={handleChange} variant="outlined" required
                  />
                  {/* Validacion del campo */}
                  {errorFechas ? <Typography className={classes.validator}> {errorFechas} </Typography> : null}
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth className={classes.field} name="fechaFin" value={values.fechaFin} label="Fecha de fin" type="date"
                    InputLabelProps={{ shrink: true }} onChange={handleChange} variant="outlined"
                  />
                  {/* Validacion del campo */}
                  {errorFechas ? <Typography className={classes.validator}> {errorFechas} </Typography> : null}
                </Grid>
              </Grid>

              <TextField className={classes.field} name="horasAsignadas" value={values.horasAsignadas} label="Nº de horas asignadas" type="number"
                onChange={handleChange} required variant="outlined"
              />
              {/* Validacion del campo */}
              {errorHoras ? <Typography className={classes.validator}> {errorHoras} </Typography> : null}
              
              {/*<PDFUpload uploadFile={uploadFile} name="Justificante" /> */}
              
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
export default ActivityOneEdit;