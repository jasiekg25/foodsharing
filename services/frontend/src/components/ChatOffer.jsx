import React, {useEffect, useState} from 'react';
import Card from "@material-ui/core/Card";
import cx from "clsx";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import placeholder from "../img/placeholder.jpg";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import Star from "@material-ui/icons/Star";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Rating from "@material-ui/lab/Rating";
import DialogActions from "@material-ui/core/DialogActions";
import api from "../api";
import {makeStyles} from "@material-ui/core/styles";
import {history} from "../index";
import {toast} from "../utils/toastWrapper";
import {useFadedShadowStyles} from '@mui-treasury/styles/shadow/faded';
import ChatIcon from "@material-ui/icons/Chat";
import {Collapse} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import {Form} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";


const useStyles = makeStyles(({palette}) => ({
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
    avatar: {
        float: "right",
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: '0.5px',
        marginTop: 8,
    },
    photo: {
        float: "left",
        height: "27%",
        width: "27%",
    },
    buttons: {
        float: "right",
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

function ChatOffer({offerId, isOrdered, orderHistory, offer, isMyOffer}) {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
    const [showConfirmPickupModal, setShowConfirmPickupModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [chosenOrder, setChosenOrder] = useState({});
    const [showModal, setShowModal] = useState(false);


    const styles = useStyles();
    const shadowStyles = useFadedShadowStyles();

    const handleCancelOrderClose = () => {
        setShowCancelOrderModal(false);
    }
    const handleCancelOrderShow = (order) => {
        setChosenOrder(order)
        setShowCancelOrderModal(true);
    }

    const handleConfirmPickupClose = () => {
        setShowConfirmPickupModal(false);
    }
    const handleConfirmPickupShow = (order) => {
        setChosenOrder(order)
        setShowConfirmPickupModal(true);
    }

    const handleShowUserProfile = (id) => {
        history.push(`/users/${id}`);
    }

    const cancelOrder = () => {
        handleCancelOrderClose();
        chosenOrder.is_canceled = true;
        api.putUserOrdersHistory(chosenOrder)
            .then((res) => {
                toast.success(`Your order has been canceled!`);
                console.log(res.data);
            })
            .catch((err) => {
                toast.error("Could not cancel your order.")
                console.log("Could not cancel your order " + err.message);
            })
    }

    const confirmPickup = (offer_author) => {
        handleConfirmPickupClose();
        chosenOrder.is_picked = true;
        if (rating > 0)
            api.postSharerRating({'to_user_id': offer_author, 'rating': rating})
                .then((res) => {
                    console.log(res.data);
                })
                .catch((err) => {
                    toast.error(err);
                    console.error("Could not rate user.");
                })
        api.putUserOrdersHistory(chosenOrder)
            .then((res) => {
                toast.success(`Your order pick up has been confirmed!`);
                console.log(res.data);
            })
            .catch((err) => {
                toast.error("Could not confirm pick up.")
                console.log("Could not confirm pick up " + err.message);
            })
    }


    const handleClose = () => {
        setShowModal(false);
    }
    const handleShow = (offer) => {
        setShowModal(true);
    }

    const orderMeal = (data) => {
        handleClose();
        data['offer_id'] = offer.id;
        api.postOrder(data)
            .then((res) => {
                toast.success(`${offer.name} order was successful.`);
                console.log(res.data);
                window.location.reload(false)
            })
            .catch((err) => {
                console.log("Could not order meal " + err)
                toast.error(`Could not order ${offer.name}`);
            })
        document.getElementById("create-course-form").reset();
    }

    return (
        <div>
        {isOrdered && !isMyOffer ? orderHistory.map((order) => {
                        return (
                            <Card key={order.id} className={cx(styles.card, shadowStyles.root)}>
                                <CardContent>
                                    {
                                        order.offer_photo ?
                                            <CardMedia className={styles.photo}
                                                       src={order.offer_photo}
                                                       component="img"
                                            /> :
                                            <CardMedia className={styles.photo}
                                                       src={placeholder}
                                                       component="img"
                                            />
                                    }
                                    <ul className={styles.avatar}>
                                        <Chip avatar={<Avatar onClick={(e) => handleShowUserProfile(order.fromUser_id)}
                                                              className={styles.avatar} src={order.fromUser_photo}/>}
                                              label={order.fromUser_name} variant="outlined"/>
                                        <Chip avatar={<Star fontSize="inherit" style={{color: '#ffc107'}}/>} label={order.fromUser_rating}
                                              variant="outlined"/>
                                    </ul>
                                    <h3 className={styles.heading}>{order.offer_name}</h3>
                                    <ul>
                                        {order.tags.map((tag) =>
                                            <Chip className={styles.tag} size="small" label={`#${tag.tag_name}`} />
                                        )}
                                    </ul>
                                    <Grid className={styles.icons}>
                                        <Typography variant="body2" color="textSecondary" component="p"> Ordered
                                            portions: {order.portions}</Typography>
                                    </Grid>
                                </CardContent>
                                {(!order.is_picked && !order.is_canceled) ?
                                    <CardContent>
                                        <CardActions className={styles.buttons}>
                                            <Button size="medium" color="primary"
                                                    onClick={(e) => handleConfirmPickupShow(order)}>
                                                Confirm pickup
                                            </Button>
                                            <Button size="medium" color="primary"
                                                    onClick={(e) => handleCancelOrderShow(order)}>
                                                Cancel order
                                            </Button>
                                        </CardActions>
                                    </CardContent> : null
                                }
                                {
                                    order.is_picked ?
                                        <CardContent>
                                            <Typography className={styles.confirmLabel} variant="body2" component="p">You
                                                have picked up your order!</Typography>
                                        </CardContent> : null
                                }
                                {
                                    order.is_canceled ?
                                        <CardContent>
                                            <Typography className={styles.cancelLabel} variant="body2" component="p">You
                                                have canceled your order!</Typography>
                                        </CardContent> : null
                                }
                                <Dialog
                                    open={showConfirmPickupModal}
                                    onClose={(e) => handleConfirmPickupClose()}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    fullWidth={true}
                                >
                                    <DialogTitle id="alert-dialog-title">{"Confirm order pick up"}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            Are you sure you want to confirm that {order.offer_name} pick up?
                                        </DialogContentText>
                                        <Rating
                                            onChange={(event, newValue) => {
                                                setRating(newValue);
                                            }}
                                            name="half-rating"
                                            value={rating}
                                            precision={0.5}
                                            size="large"
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={(e) => confirmPickup(order.fromUser_id)} color="primary">
                                            Confirm
                                        </Button>
                                        <Button onClick={(e) => handleConfirmPickupClose()} color="primary" autoFocus>
                                            Cancel
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog
                                    open={showCancelOrderModal}
                                    onClose={(e) => handleCancelOrderClose()}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    fullWidth={true}
                                >
                                    <DialogTitle id="alert-dialog-title">{"Cancel order"}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            Are you sure you want to cancel {order.offer_name} order?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={(e) => cancelOrder()} color="primary">
                                            Confirm
                                        </Button>
                                        <Button onClick={(e) => handleCancelOrderClose()} color="primary" autoFocus>
                                            Cancel
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Card>
                        );
                    }
                )
                :
            <Card className={cx(styles.card, shadowStyles.root)}>
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
                        <Chip avatar={<Avatar onClick={(e) => handleShowUserProfile(offer.user_id)} className={styles.avatar} src={offer.user_photo}/>} label={offer.user_name} variant="outlined"/>
                        <Chip avatar={<Star fontSize="inherit" style={{color:'#ffc107'}}/>} label={offer.user_rating} variant="outlined"/>
                    </ul>
                    <CardContent>
                        <h3 className={styles.heading}>{offer.name}</h3>
                    </CardContent>
                    <ul>
                        {(offer.tags || []).map((tag) =>
                            <Chip className={styles.tag} size="small" label={`#${tag}`} />
                        )}
                    </ul>
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
                    <CardContent>
                        {
                            !isMyOffer ? <CardActions className={styles.buttons}>
                                <Button size="medium" color="primary" onClick={() => handleShow(offer)}>
                                    Make order
                                </Button>
                            </CardActions> : null
                        }
                    </CardContent>
                    <Collapse >
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
                    <DialogTitle id="alert-dialog-title">{`Choose number of ${offer.name} portions:`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <form id="create-course-form"
                                  onSubmit={handleSubmit((data) => {orderMeal(data)})}
                                  noValidate>
                                <Form.Control size="lg" {...register(portions.name)} type={portions.type} min="0" max={offer.portions_number - offer.used_portions} defaultValue='0'/>
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
        }
        </div>
    )
}

export default ChatOffer;
