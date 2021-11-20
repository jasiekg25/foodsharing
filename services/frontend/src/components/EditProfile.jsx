import React, {useState} from 'react';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import api from "../api";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from '@material-ui/core/TextField';
import FileUplader from './fileUplader/FileUplader';


function EditProfile({showEditProfile, setShowEditProfile, user, updateUser}) {
    const {id, email, profile_description, profile_picture, phone} = user;
    const [userEmail, setUserEmail] = useState(email);
    const [userProfileDescription, setUserProfileDescription] = useState(profile_description);
    const [userProfilePicture, setUserProfilePicture] = useState(profile_picture);
    const [userPhone, setUserPhone] = useState(phone);

    const handleSaveChanges = () => {
        console.log(userEmail);
        const updatedProfile = {
            email: userEmail ? userEmail : email,
            profile_description: userProfileDescription ? userProfileDescription : profile_description,
            phone: userPhone ? userPhone : phone,
        }

        const formData = new FormData();
        formData.append('photo', userProfilePicture);
        formData.append('data', JSON.stringify(updatedProfile));

        api.putProfile(formData)
            .then((res) => {
                updateUser();
                setShowEditProfile(!showEditProfile);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <Dialog
            open={showEditProfile}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
        >
            <DialogTitle id="alert-dialog-title">{"Edit your profile"}</DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            variant='outlined'
                            required
                            id='email'
                            label='Email'
                            defaultValue={email}
                            onChange={(e) => setUserEmail(e.target.value)}
                            fullWidth
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        variant='outlined'
                        required
                        id='phone'
                        label='Phone Number'
                        defaultValue={phone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        fullWidth
                        autoFocus
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant='outlined'
                            id='profileDescription'
                            label='Profile Description'
                            defaultValue={profile_description}
                            value={userProfileDescription}
                            onChange={(e) => setUserProfileDescription(e.target.value)}
                            fullWidth
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FileUplader file={profile_picture} setFile={setUserProfilePicture} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleSaveChanges(userEmail)} color="primary">
                    Save changes
                </Button>
                <Button onClick={(e) => setShowEditProfile(!showEditProfile)} color="primary" autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditProfile;