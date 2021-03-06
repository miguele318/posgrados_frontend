import React, { useEffect, useState } from 'react';
import {
  Card, Grid, TextField, makeStyles, Container, Typography, Divider, InputLabel, Select, MenuItem, FormControl
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

const tipo = [
  { value: 'T1', label: 'Interna' },
  { value: 'T2', label: 'Externa' },
];

export const ActivitySixEdit = ({ state, callbackDialogOpen }) => {
  const classes = useStyles();

    useEffect(() => {
        if(state.receipt !== null) {
          document.getElementById("text-file").textContent = "El archivo previamente registrado esta cargado";
        }
      }, []);

  // Estado que controla los valores del formulario
  const [values, setValues] = useState({
    id: state.id,
    nombreProyecto: state.name,
    investigadorSeleccionado: state.investigator,
    lugarTrabajo: state.place,
    descripcion: state.description,
    lineaSeleccionada: state.investigation_line,
    codigoVRI: state.code_VRI,
    convocatoria: state.convocation,
    tipoSeleccionado: state.type_convocation,
    fechaInicio: state.start_date,
    fechaFin: state.end_date
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

  const [errorNombreProyecto, setErrorNombreProyecto] = useState(null);
  const [errorNombreInvestigador, setErrorNombreInvestigador] = useState(null);
  const [errorLugarTrabajo, setErrorLugarTrabajo] = useState(null);
  const [errorDescripcion, setErrorDescripcion] = useState(null);
  const [errorLinea, setErrorLinea] = useState(null);
  const [errorCodigoVRI, setErrorCodigoVRI] = useState(null);
  const [errorConvocatoria, setErrorConvocatoria] = useState(null);
  const [errorTipo, setErrorTipo] = useState(null);
  const [errorStartDate, setErrorStartDate] = useState(null);
  const [errorEndDate, setErrorEndDate] = useState(null);
  const [errorFile, setErrorFile] = useState(null);

  const  resetError = () => {
    setErrorNombreProyecto(null);
    setErrorNombreInvestigador(null);
    setErrorLugarTrabajo(null);
    setErrorDescripcion(null);
    setErrorLinea(null);
    setErrorCodigoVRI(null);
    setErrorConvocatoria(null);
    setErrorTipo(null);
    setErrorStartDate(null);
    setErrorEndDate(null);
    setErrorFile(null);
  }

  //"validar" permite verificar que todos los campos requeridos se encuentren diligenciados 
  const validarGuardarYEnviar = () => {
    resetError();
    var result = true;
    result = validarGuardar();
    
    if(values.fechaFin !== null){
      if (values.fechaFin.length) {
        if (values.fechaInicio <= values.fechaFin) { setErrorEndDate("") }
        else {
          setErrorEndDate("La fecha Fin del proyecto debe ser después de la fecha de inicio del proyecto")
          result = false;
        }
      }
      else {
        setErrorEndDate("Seleccióne fecha fin del proyecto válida")
        result = false;
      }
    }
    else {
      setErrorEndDate("Seleccióne fecha fin del proyecto válida")
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

    if (values.nombreProyecto !== '') { 
      if(values.nombreProyecto.length < 61) {setErrorNombreProyecto(null)}
      else{
        setErrorNombreProyecto("El campo debe tener máximo 60 caracteres");
        result = false;
      }
    }
    else {
      setErrorNombreProyecto("El campo es obligatorio");
      result = false;
    }
    if (values.investigadorSeleccionado !== 0) { setErrorNombreInvestigador(null) }
    else {
      setErrorNombreInvestigador("Seleccione una opción válida");
      result = false;
    }
    if (values.lugarTrabajo !== '') { 
      
      if(values.lugarTrabajo.length < 41){setErrorLugarTrabajo(null)}
      else{
        setErrorLugarTrabajo("El campo debe tener máximo 40 caracteres");
        result = false;
      }
    }
    else {
      setErrorLugarTrabajo("El campo es obligatorio");
      result = false;
    }
    if(values.descripcion !== ''){
      if (values.descripcion.length < 149){ setErrorDescripcion(null) }
      else{
        setErrorDescripcion("El campo debe tener máximo 148 caracteres");
        result = false;
      }
    }
    else {
      setErrorDescripcion("El campo es obligatorio");
      result = false;
    }
    if (values.lineaSeleccionada !== 0) { setErrorLinea(null) }
    else {
      setErrorLinea("Seleccione una opción válida");
      result = false;
    }
    if (values.codigoVRI > 0 && values.codigoVRI !== "") { 
      if(values.codigoVRI <= 10000000000000000 ){setErrorCodigoVRI(null) }
      else{
        setErrorCodigoVRI("Código demaciado extenso")
        result = false;
      }
    }
    else {
      setErrorCodigoVRI("Código invalido")
      result = false;
    }
    if(values.convocatoria !== ''){
      if (values.convocatoria.length < 148) { setErrorConvocatoria(null) }
      else{
        setErrorConvocatoria("El campo debe tener máximo 148 caracteres");
        result = false;
      }
    }
    else { 
      setErrorConvocatoria("El campo es obligatorio");
      result = false;
    }
    if (values.tipoSeleccionado !== 0) { setErrorTipo(null) }
    else {
      setErrorTipo("Seleccione una opción válida");
      result = false;
    }
    if (values.fechaInicio.length) {
      setErrorStartDate("") 
    }
    else {
      setErrorStartDate("Seleccióne fecha de inicio del proyecto válida")
      result = false;
    }
    if(values.fechaFin !== null){
        if (values.fechaFin.length) {
            if (values.fechaInicio <= values.fechaFin) { setErrorEndDate("") }
            else {
                setErrorEndDate("La fecha de finalización debe ser después de la fecha de inicio")
                result = false;
            }
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
    //Se captura el valor booleano de "emergenteGuardarYEnviar" y se envía en el 
    //documento JSON con el fin de saber si se debe enviar el email a quien corresponda
    var send_email = emergenteGuardarYEnviar;

    const fd = new FormData();
    fd.append("id", values.id);
    fd.append("name", values.nombreProyecto);
    fd.append("description", values.descripcion);
    fd.append("start_date", values.fechaInicio);
    if (values.fechaFin === null) { values.fechaFin = ''; }
    fd.append("end_date", values.fechaFin);
    fd.append("place", values.lugarTrabajo);
    fd.append("code_VRI", values.codigoVRI);
    fd.append("convocation", values.convocatoria);
    fd.append("type_convocation", values.tipoSeleccionado);
    fd.append("investigation_line", values.lineaSeleccionada);
    fd.append("investigator", values.investigadorSeleccionado);
    // Datos adicionales
    fd.append("academic_year", state.academic_year);
    fd.append("student", 36); // Consultar el id del estudiante actual
    fd.append("date_record", state.date_record);
    fd.append("date_update", now);
    //fd.append("is_active", true);
    if (send_email) {
      fd.append("send_email", send_email);
      fd.append("state", 2);
    }
    if (archivo !== null) { fd.append("receipt", archivo[0]); }

    objService.PutActivitySixEdit(fd, values.id).then((result) => {
      setResponse("Actividad registrada correctamente");
    }).catch(() => {
      setResponse("Ups! Ha ocurrido un error al registrar la actividad, intentelo mas tarde o contacte con el administrador");
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
              <TextField className={classes.field} fullWidth label="Nombre del proyecto" name="nombreProyecto" 
                onChange={handleChange} required variant="outlined" value={values.nombreProyecto}
              />
              {/* Validacion del campo */}
              {errorNombreProyecto ? <Typography className={classes.validator}> {errorNombreProyecto} </Typography> : null}

              <SelectField name="investigadorSeleccionado" label="Investigador" handleChange={handleChange} Selected={values.investigadorSeleccionado} />
              {/* Validacion del campo */}
              {errorNombreInvestigador ? <Typography className={classes.validator}> {errorNombreInvestigador} </Typography> : null}

              <TextField className={classes.field} fullWidth label="Lugar de trabajo" name="lugarTrabajo" onChange={handleChange} 
                required variant="outlined" value={values.lugarTrabajo}
              />
              {/* Validacion del campo */}
              {errorLugarTrabajo ? <Typography className={classes.validator}> {errorLugarTrabajo} </Typography> : null}

              <TextField className={classes.field} fullWidth label="Descripción de actividad" name="descripcion" 
                onChange={handleChange} required variant="outlined" value={values.descripcion}
              />
              {/* Validacion del campo */}
              {errorDescripcion ? <Typography className={classes.validator}> {errorDescripcion} </Typography> : null}

              <SelectField name="lineaSeleccionada" label="Linea de investigación" handleChange={handleChange} Selected={values.lineaSeleccionada}/>
              {/* Validacion del campo */}
              {errorLinea ? <Typography className={classes.validator}> {errorLinea} </Typography> : null}

              <TextField className={classes.field} name="codigoVRI" label="Codigo VRI" type="number" value={values.codigoVRI}
                onChange={handleChange} required variant="outlined"
              />
              {/* Validacion del campo */}
              {errorCodigoVRI ? <Typography className={classes.validator}> {errorCodigoVRI} </Typography> : null}

              <TextField className={classes.field} fullWidth label="Convocatoria" name="convocatoria" 
                onChange={handleChange} required variant="outlined" value={values.convocatoria}
              />
              {/* Validacion del campo */}
              {errorConvocatoria ? <Typography className={classes.validator}> {errorConvocatoria} </Typography> : null}

              <FormControl className={classes.field} fullWidth required variant="outlined">
                <InputLabel> Tipo de convocatoria </InputLabel>
                <Select defaultValue={0} onChange={handleChange} value={values.tipoSeleccionado} label="Tipo de convocatoria" name="tipoSeleccionado">
                  <MenuItem disabled value={0}> Seleccione una opción... </MenuItem>
                  {tipo.map(element => (
                    <MenuItem key={element.value} value={element.label}> { element.label} </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Validacion del campo */}
              {errorTipo ? <Typography className={classes.validator}> {errorTipo} </Typography> : null}

              {/*justify="space-evenly"*/}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField fullWidth className={classes.field} name="fechaInicio" label="Fecha de inicio" type="date" 
                    InputLabelProps={{ shrink: true }} onChange={handleChange} variant="outlined" required value={values.fechaInicio}
                  />
                  {/* Validacion del campo */}
                  {errorStartDate ? <Typography className={classes.validator}> {errorStartDate} </Typography> : null}
                </Grid>
                <Grid item xs={6}>
                  {values.fechaFin == null ? values.fechaFin = '' : null}
                  <TextField fullWidth className={classes.field} name="fechaFin" label="Fecha de fin" type="date"
                    InputLabelProps={{ shrink: true }} onChange={handleChange} variant="outlined" value={values.fechaFin}
                  />
                  {/* Validacion del campo */}
                  {errorEndDate ? <Typography className={classes.validator}> {errorEndDate} </Typography> : null}
                </Grid>
              </Grid>
              
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
export default ActivitySixEdit;