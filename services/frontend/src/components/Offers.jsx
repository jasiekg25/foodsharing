import React, {useState} from 'react';
import api from "../api.js";
// import "./Offers.css";
import {toast} from "../utils/toastWrapper";
import 'react-toastify/dist/ReactToastify.css';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {history} from "../index";
import placeholder from "../img/placeholder.jpg";
import InfiniteScroll from 'react-infinite-scroll-component';
import {makeStyles} from "@material-ui/core/styles";
import {useFadedShadowStyles} from '@mui-treasury/styles/shadow/faded';
import cx from "clsx";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Avatar from "@material-ui/core/Avatar";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import ChatIcon from '@material-ui/icons/Chat';
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";
import Chip from "@material-ui/core/Chip";
import {Collapse} from "@material-ui/core";
import Star from '@material-ui/icons/Star';
import {Form} from "react-bootstrap";


const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: "100%",
        marginTop: 5,
        overflow: 'auto',
        overflowY: "scroll",
        scrollbarWidth: "none" /* Firefox */,
        "&::-webkit-scrollbar": {
            display: "none"
        },
    },
    itemsCard: {
        flexGrow: 1,
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 12,
        maxWidth: 700,
        textAlign: 'center',
        overflow: 'auto',
        scrollbarWidth: "none" /* Firefox */,
        maxHeight: 300,
        "&::-webkit-scrollbar": {
            display: "none"
        },

    },
    avatar: {
        float: "right",
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: '0.5px',
        marginTop: 30,
        marginLeft: "40%"
    },
    photo: {
        float: "left",
        height: "40%",
        width: "40%",
    },
    header: {
        height: 10,
    },
    buttons: {
        float: "right"
    },
    icons: {
        marginTop: 10,
        marginBottom: 10,
        color: "textSecondary",
        display: "flex",
        alignItems: "right",
        justifyContent: "center",
    },
    statLabel: {
        fontSize: 12,
        color: theme.palette.grey[500],
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
        boxShadow: theme.palette.grey[500],
        // padding: palette.spacing(2, 4, 3),
    },
    info: {
        marginLeft: 70
    },
    description: {
        marginLeft: 0,
        margin: "auto"
    },
    tag: {
        margin: '1px',
    },
}));

let portions = {
    name: "portions",
    label: "Portions number",
    type: "number",
};

const schema = yup.object().shape({
    portions: yup
        .number()
        .moreThan(0, "Portions number has to be greater than 0."),
});

function Offers({offers, getOffers, onOfferSelect, hasNextPage}) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
    });

    const styles = useStyles();
    const shadowStyles = useFadedShadowStyles();

    const [chosenOffer, setChosenOffer] = useState({})
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => {
        setShowModal(false);
    }
    const handleShow = (offer) => {
        setChosenOffer(offer);
        setShowModal(true);
    }

    const handleShowUserProfile = (id) => {
        history.push(`/users/${id}`);
    }

    const orderMeal = (data) => {
        handleClose();
        data['offer_id'] = chosenOffer.id;
        api.postOrder(data)
            .then((res) => {
                getOffers(true);
                toast.success(`${chosenOffer.name} order was successful.`);
                console.log(res.data);
            })
            .catch((err) => {
                console.log("Could not order meal " + err)
                toast.error(`Could not order ${chosenOffer.name}`);
            })
        document.getElementById("create-course-form").reset();
    }

    const sendMessage = (offer) => {
        offer.offer_id = offer.id
        api.putUserChatRoom(offer)
            .then((res) => {
                console.log(res)
            history.push(`/chat/${res.data.id}/offers/${res.data.offer_id}`)
        }).catch((err) => {
            console.log("Failed to redirect to chat room" + err)
            toast.error(`Failed to redirect to chat room`);
        })
    }

    return (
            <InfiniteScroll
                dataLength={offers.length} //This is important field to render the next data
                next={getOffers}
                hasMore={hasNextPage}
                height='1000px'
                loader={<LinearProgress />}
                className={cx(styles.card)}
                >
                <Box>
                    {offers.map((offer) => {
                        return (
                            <Card key={offer.id} className={cx(styles.itemsCard, shadowStyles.root)} onClick={() => {
                                onOfferSelect(offer)
                            }}>
                                <CardContent>
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
                                    <ul className={styles.avatar}>
                                        <Chip avatar={<Avatar  className={styles.avatar} src={offer.photo}/>} label={offer.user_name} variant="outlined" onClick={(e) => handleShowUserProfile(offer.user_id)} style={{marginRight: '5px'}} />
                                        <Chip avatar={<Star fontSize="inherit" style={{color:'#ffc107'}}/>} label={offer.user_rating} variant="outlined"/>
                                    </ul>
                                    <CardContent>
                                        <h3 className={styles.heading}>{offer.name}</h3>
                                    </CardContent>
                                    <ul>
                                        {offer.tags.map((tag) => 
                                            <Chip className={styles.tag} size="small" label={`#${tag}`} />
                                        )}
                                    </ul>
                                    <CardContent>
                                        <CardActions className={styles.buttons}>
                                            <Button color="primary" onClick={(e) => sendMessage(offer)} startIcon={<ChatIcon />}>
                                                Chat
                                            </Button>
                                            <Button size="medium" color="primary" onClick={() => handleShow(offer)}>
                                                Make order
                                            </Button>
                                        </CardActions>
                                    </CardContent>
                                    <Collapse in={offer.expanded} timeout="auto" unmountOnExit>
                                        <Box display={'flex'} className={styles.info} >
                                            <Box p={5} flex={'auto'} >
                                                <p className={styles.statLabel}>Pick-up times: </p>
                                                <Typography variant="body2" color="textSecondary" component="p"> {offer.pickup_times}</Typography>
                                            </Box>
                                            <Box p={5} flex={'auto'} >
                                                <p className={styles.statLabel}>Expire date: </p>
                                                <Typography variant="body2" color="textSecondary" component="p"> {offer.offer_expiry}</Typography>
                                            </Box>
                                            <Box p={5} flex={'auto'} >
                                                <p className={styles.statLabel}>Remaining portions: </p>
                                                <Typography variant="body2" color="textSecondary" component="p"> {offer.portions_number - offer.used_portions}</Typography>
                                            </Box>
                                        </Box>
                                    </Collapse>
                                </CardContent>
                                <Dialog
                                    open={showModal}
                                    onClose={(e) => handleClose()}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    fullWidth={true}
                                >
                                    <DialogTitle id="alert-dialog-title">{`Choose number of ${chosenOffer.name} portions:`}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            <form id="create-course-form"
                                                onSubmit={handleSubmit((data) => {orderMeal(data)})}
                                                noValidate>
                                                <Form.Control size="lg" {...register(portions.name)} type={portions.type} min="1" max={chosenOffer.portions_number - chosenOffer.used_portions} defaultValue='1'/>
                                                <DialogActions>
                                                    <Button color="primary" type="submit">
                                                        Order
                                                    </Button>
                                                    <Button onClick={(e) => handleClose()} color="primary" autoFocus>
                                                        Cancel
                                                    </Button>
                                                </DialogActions>
                                            </form>
                                        </DialogContentText>
                                    </DialogContent>
                                </Dialog>
                            </Card>
                        )
                    })}
                </Box>
            </InfiniteScroll>
    )
}

export default Offers;
