import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../api.js';
import TagSearch from '../TagSearch';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import FileUplader from '../fileUplader/FileUplader';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MapPicker from "../maps/MapPicker";
import useMap from "../maps/useMap"
import { useTags } from '../../hooks/useTags';


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: '40vw',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = ['Offer information', 'Pickup localization'];

const handleAddMealSubmit = (
  data,
  expireDate,
  selectedTags,
  coordinates,
  photo
) => {
  expireDate.setHours(23, 59, 59);

  const request = {
    name: data.title,
    pickup_times: data.pickup,
    description: data.description,
    portions_number: data.portions || 1,
    offer_expiry: expireDate.toLocaleString('en-US'),
    tags: selectedTags.map((tag) => tag.id),
    latitude: coordinates.lat,
    longitude: coordinates.lng,
  };

  const formData = new FormData();
  formData.append('photo', photo);
  formData.append('data', JSON.stringify(request));

  api
    .postOffers(formData)
    .then((res) => {
      console.log(res);
      return true;
    })
    .catch((err) => {
      console.log(err);
    });
};

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  portions: yup.number().moreThan(0, 'Portions number must positive value'),
  pickup: yup.string().required('Pick-up Times are required'),
});

export default function Checkout() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const { tags, selectedTags, setSelectedTags } = useTags();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [file, setFile] = useState('');
  const { mapRef, center, setCenter } = useMap({
    lat: 50.06143,
    lng: 19.93658,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const onSubmit = (data) => {
    if (isLastStep()) {
      handleAddMealSubmit(data, selectedDate, selectedTags, center, file);
    }
    handleNext();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <React.Fragment>
            <Typography variant='h6' gutterBottom>
              Offer Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  required
                  id='title'
                  name='title'
                  label='Title'
                  fullWidth
                  autoFocus
                  {...register('title')}
                  error={!!errors.title}
                  helperText={errors?.title?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  id='description'
                  name='description'
                  label='Description'
                  fullWidth
                  multiline
                  rows={3}
                  {...register('description')}
                />
              </Grid>
              <Grid item xs={12}>
                <TagSearch
                  style={{}}
                  tags={tags}
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant='outlined'
                  required
                  id='portions'
                  name='portions'
                  label='Number of Portions'
                  InputProps={{
                    inputProps: {
                      max: 10,
                      min: 1,
                      defaultValue: 1,
                    },
                  }}
                  type='number'
                  fullWidth
                  {...register('portions')}
                  error={!!errors.portions}
                  helperText={errors?.portions?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant='inline'
                    format='MM/dd/yyyy'
                    margin='normal'
                    id='date-picker-inline'
                    label='Offer Expiration Date'
                    value={selectedDate}
                    onChange={setSelectedDate}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    inputVariant='outlined'
                    fullWidth
                    style={{ margin: 0 }}
                    minDate={new Date()}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  id='pickup-times'
                  name='pickup-times'
                  label='Pick-up Times'
                  placeholder='Eg. Mondays 16 - 20'
                  fullWidth
                  multiline
                  rows={2}
                  {...register('pickup')}
                  error={!!errors.pickup}
                  helperText={errors?.pickup?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <FileUplader file={file} setFile={setFile} />
              </Grid>
            </Grid>
          </React.Fragment>
        );
      case 1:
        return (
          <div>
            <MapPicker
              mapRef={mapRef}
              center={center}
              setCenter={setCenter}
              className='map-control'
            />
          </div>
        );
      default:
        throw new Error('Unknown step');
    }
  }

  const isLastStep = () => activeStep === steps.length - 1;

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component='h1' variant='h4' align='center'>
              New Meal
            </Typography>
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <React.Fragment>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography variant='h5' gutterBottom>
                    Thank you for sharing!
                  </Typography>
                  <Typography variant='subtitle1'>
                    Your offer has been successfully created. We will send you a
                    notification once someone orders your meal.
                  </Typography>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {getStepContent(activeStep)}
                  <div className={classes.buttons}>
                    {/* {activeStep !== 0 && (
                      <Button onClick={handleBack} className={classes.button}>
                        Back
                      </Button>
                    )} */}
                    <Button
                      variant='contained'
                      color='primary'
                      className={classes.button}
                      type={'submit'}
                    >
                      {isLastStep() ? 'Create offer' : 'Next'}
                    </Button>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          </Paper>
        </main>
      </form>
    </React.Fragment>
  );
}
