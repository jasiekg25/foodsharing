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
import {toast} from "react-toastify";
import placeholder from "../img/placeholder.jpg";
import Rating from "@material-ui/lab/Rating";


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
        marginTop: 8,
    },
    photo: {
        float: "left",
        height: "30%",
        width: "30%",
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
}));

function Order(props) {
    const [orderHistory, setOrderHistory] = useState([]);
    const [chosenOrder, setChosenOrder] = useState({});
    const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
    const [showConfirmPickupModal, setShowConfirmPickupModal] = useState(false);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        getOrders();
    }, [])

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

    const getOrders = () => {
        api.getUserOrdersHistory()
            .then((res) => {
                setOrderHistory(res.data);
            })
            .catch((err) => {
                console.log("Could not get current user orders" + err.message);
            })
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
                getOrders();
            })
            .catch((err) => {
                getOrders();
                toast.error("Could not cancel your order.")
                console.log("Could not cancel your order " + err.message);
            })
    }

    const confirmPickup = (offer_author) => {
        handleConfirmPickupClose();
        chosenOrder.is_picked = true;
        if (rating > 0)
            api.postSharerRating({'to_user_id': offer_author,'rating': rating})
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
                getOrders();
            })
            .catch((err) => {
                getOrders();
                toast.error("Could not confirm pick up.")
                console.log("Could not confirm pick up " + err.message);
            })
    }
    const styles = useStyles();
    const shadowStyles = useFadedShadowStyles();

    return (
        orderHistory.map((order) => {
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
                            <Avatar onClick={(e) => handleShowUserProfile(order.fromUser_id)} className={styles.avatar} src={order.fromUser_photo}/>
                            <h3 className={styles.heading}>{order.offer_name}</h3>
                            <Grid className={styles.icons}>
                                <Typography variant="body2" color="textSecondary" component="p"> Ordered portions: {order.portions}</Typography>
                            </Grid>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {order.offer_description}
                            </Typography>
                        </CardContent>
                        {(!order.is_picked && !order.is_canceled) ?
                            <CardContent>
                                <CardActions className={styles.buttons}>
                                    <Button size="medium" color="primary" onClick={(e) => handleConfirmPickupShow(order)}>
                                        Confirm pickup
                                    </Button>
                                    <Button size="medium" color="primary" onClick={(e) => handleCancelOrderShow(order)}>
                                        Cancel order
                                    </Button>
                                </CardActions>
                            </CardContent> : null
                        }
                        {
                            order.is_picked ?
                                <CardContent>
                                    <Typography className={styles.confirmLabel} variant="body2" component="p">You have picked up your order!</Typography>
                                </CardContent> : null
                        }
                        {
                            order.is_canceled ?
                                <CardContent>
                                    <Typography className={styles.cancelLabel} variant="body2" component="p">You have canceled your order!</Typography>
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
                                <Button onClick={(e) =>handleConfirmPickupClose()} color="primary" autoFocus>
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
                                <Button onClick={(e) =>handleCancelOrderClose()} color="primary" autoFocus>
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

export default Order;