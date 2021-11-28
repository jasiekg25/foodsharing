import React, {useEffect, useState} from 'react';
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import {makeStyles} from "@material-ui/core/styles";
import cx from "clsx";
import {useFadedShadowStyles} from '@mui-treasury/styles/shadow/faded';
import CardMedia from "@material-ui/core/CardMedia";
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';
import Grid from "@material-ui/core/Grid";
import api from "../api";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import {history} from "../index";
import {toast} from "../utils/toastWrapper";
import placeholder from "../img/placeholder.jpg";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import CardHeader from "@material-ui/core/CardHeader";
import {Delete, DeleteOutline} from "@material-ui/icons";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import Star from "@material-ui/icons/Star";
import ChatIcon from "@material-ui/icons/Chat";
import {Collapse} from "@material-ui/core";
import {useGutterBorderedGridStyles} from '@mui-treasury/styles/grid/gutterBordered';



const useStyles = makeStyles(({palette}) => ({
    card: {
        maxWidth: "100%",
        marginTop: 5,
    },
    avatar: {
        float: "right",
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: '0.5px',
        marginLeft: 25,
    },
    photo: {
        float: "left",
        height: "100%",
        width: "100%",
    },
    header: {
        height: 10,
    },
    buttons: {
        marginLeft: 150,
    },
    icons: {
        marginTop: 10,
        marginBottom: 10,
        color: "textSecondary",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    statLabel: {
        fontSize: 12,
        color: palette.grey[500],
        fontWeight: 100,
        fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        margin: 0,
    },
    confirmLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: "#016f4a",
    },
    cancelLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: "#F50057",
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: "white",
        border: '2px solid #000',
        boxShadow: palette.grey[500],
        // padding: palette.spacing(2, 4, 3),
    },
    tag: {
        margin: '1px',
    },
}));

function MyOffers(props) {
    const [userOffers, setUserOffers] = useState([]);
    const [chosenOffer, setChosenOffer] = useState({})
    const [showDeleteOfferModal, setShowDeleteOfferModal] = useState(false);

    useEffect(() => {
        getOffers();
    }, [])

    const getOffers = () => {
        api.getUserCurrentOffers()
            .then((res) => {setUserOffers(res.data);
            })
            .catch((err) => {
                console.log("Could not get current user " + err.message);
            })
    }

    const deleteOffer = (offer) => {
        handleDeleteOfferClose();
        const formData = new FormData()
        offer.active = false;
        formData.append('data', JSON.stringify(offer));
        api.putUserCurrentOffers(formData)
            .then((res) => {
                toast.success(`Your offer has been deleted!`);
                console.log(res.data);
                getOffers();
            })
            .catch((err) => {
                getOffers();
                toast.error("Could not delete your offer.")
                console.log("Could not delete your offer " + err.message);
            })
    }

    const handleDeleteOfferClose = () => {
        setShowDeleteOfferModal(false);
    }
    const handleDeleteOfferShow = (offer) => {
        setChosenOffer(offer)
        setShowDeleteOfferModal(true);
    }

    const styles = useStyles();
    const shadowStyles = useFadedShadowStyles();
    const borderedGridStyles = useGutterBorderedGridStyles({
        borderColor: 'rgba(0, 0, 0, 0.08)',
        height: '50%',
    });

    return (
        userOffers.map((offer) => {
                return (
                    <Card key={offer.id} className={cx(styles.card, shadowStyles.root)}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <IconButton className={styles.avatar} onClick={(e) => handleDeleteOfferShow(offer)}>
                                        <Delete/>
                                    </IconButton>
                                </Grid>
                                <Grid item sm={5} xs={12}>
                                    {
                                        offer.photo ?
                                            <CardMedia className={styles.photo}
                                                       src={offer.photo}
                                                       component="img"
                                            /> :
                                            <CardMedia className={styles.photo}
                                                       src={placeholder}
                                                       component="img"
                                            />
                                    }
                                </Grid>
                                <Grid item sm={7} xs={12}>
                                    <h3 className={styles.heading}>{offer.name}</h3>
                                    <ul>
                                        {offer.tags.map((tag) =>
                                            <Chip className={styles.tag} size="small" label={`#${tag.tag_name}`} />
                                        )}
                                    </ul>
                                </Grid>
                                    <Grid item xs={12}>
                                        <Box p={2} className={borderedGridStyles.item}>
                                            <p className={styles.statLabel}>Description: </p>
                                            <Typography variant="body2" color="textSecondary" component="p"> {offer.description}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box p={2} flex={'auto'} >
                                            <p className={styles.statLabel}>Pick-up times: </p>
                                            <Typography variant="body2" color="textSecondary" component="p"> {offer.pickup_times}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box p={2} flex={'auto'} >
                                            <p className={styles.statLabel}>Expire date: </p>
                                            <Typography variant="body2" color="textSecondary" component="p"> {offer.offer_expiry}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box p={2} flex={'auto'} >
                                            <p className={styles.statLabel}>Portions number: </p>
                                            <Typography variant="body2" color="textSecondary" component="p"> {offer.portions_number}</Typography>
                                        </Box>
                                    </Grid>
                            </Grid>
                        </CardContent>
                        <Dialog
                            open={showDeleteOfferModal}
                            onClose={(e) => handleDeleteOfferClose()}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            fullWidth={true}
                        >
                            <DialogTitle id="alert-dialog-title">{"Confirm delete offer"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure you want to delete {chosenOffer.name}?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => deleteOffer(offer)} color="primary">
                                    Confirm
                                </Button>
                                <Button onClick={(e) => handleDeleteOfferClose()} color="primary" autoFocus>
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Card>
                );
            }
        )
    )
}

export default MyOffers;
