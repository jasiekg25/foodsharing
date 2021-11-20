import React, {useEffect, useState} from 'react';
import cx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import {useFadedShadowStyles} from '@mui-treasury/styles/shadow/faded';
import {useGutterBorderedGridStyles} from '@mui-treasury/styles/grid/gutterBordered';
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';

import api from "../api";
import Order from "./Order";
import Rating from "@material-ui/lab/Rating";
import {Redirect} from "react-router-dom";
import MyOffers from "./MyOffers";
import EditProfile from './EditProfile';

const useStyles = makeStyles(({ palette, breakpoints }) => ({
    card: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 12,
        textAlign: 'center',
        overflow: 'auto',
        scrollbarWidth: "none" /* Firefox */,
        maxHeight: 500,
        "&::-webkit-scrollbar": {
            display: "none"
        },
        [breakpoints.up('sm')]: {
            marginRight: 0,
            width: '30%',
          },
    },
    itemsCard: {
        flexGrow: 1,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 12,
        textAlign: 'center',
        overflow: 'auto',
        scrollbarWidth: "none" /* Firefox */,
        maxHeight: 500,
        "&::-webkit-scrollbar": {
            display: "none"
        },
        [breakpoints.up('sm')]: {
            marginLeft: 20,
            marginRight: 0,
            maxWidth: '40%',
          },
    },
    tabList:{
        color: palette.grey[500],
        backgroundColor: 'white',
        fontFamily: 'Open Sans',
        fontSize: '1rem',
    },
    header: {
        height: 10,
    },
    avatar: {
        width: 120,
        height: 120,
        margin: 'auto',
    },
    icons: {
        marginTop: 10,
        marginBottom: 10,
        color: "textSecondary",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: '0.5px',
        marginTop: 8,
        marginBottom: 0,
    },
    subheader: {
        fontSize: 14,
        color: palette.grey[500],
        marginBottom: '0.875em',
    },
    statLabel: {
        fontSize: 12,
        color: palette.grey[500],
        fontWeight: 500,
        fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        margin: 0,
    },
    info: {
        fontSize: 10,
        color: palette.grey[500],
        fontWeight: 300,
        fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        margin: 3,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: '1px',
    },
    profilePage: {
        // width: 
    }
}));

function ProfileCard({isLoggedIn, logoutUser}) {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const styles = useStyles();
    const shadowStyles = useFadedShadowStyles();
    const borderedGridStyles = useGutterBorderedGridStyles({
        borderColor: 'rgba(0, 0, 0, 0.08)',
        height: '50%',
    });
    const [user, setUser] = useState({});
    const [showModal, setShowModal] = useState(false);

    const [showEditProfile, setShowEditProfile] = useState(false);

    useEffect(() => {
        getUserInfo();
    }, [])

    const getUserInfo = () => {
        api.getProfile()
            .then((res) => {setUser(res.data);
            })
            .catch((err) => {
                console.log("Could not get current user " + err.message);
            })
    }

    if (!isLoggedIn) {
        return <Redirect to="/login" />;
    }



    return (
        <Box display={'flex'} flexWrap="wrap" justifyContent='center'>
            <Card className={cx(styles.card, shadowStyles.root)}>
                <CardContent>
                    <CardHeader
                        className={styles.header}
                        action={
                            <IconButton aria-label="settings"
                            onClick={() => {setShowEditProfile(!showEditProfile)}}>
                                <EditIcon/>
                            </IconButton>
                        }
                    />
                    <EditProfile 
                        showEditProfile={showEditProfile}
                        setShowEditProfile={setShowEditProfile}
                        user={user}
                        updateUser={getUserInfo}
                    />
                    <Avatar className={styles.avatar} src={user.profile_picture} />
                    <h3 className={styles.heading}>{user.name} {user.surname}</h3>
                    <Box display={'flex'}>
                        <Box p={4} flex={'auto'} className={borderedGridStyles.item}>
                            <p className={styles.statLabel}>Phone number: </p>
                            <Typography variant="body2" color="textSecondary" component="p">{user.phone}</Typography>
                        </Box>
                        <Box p={4} flex={'auto'} className={borderedGridStyles.item}>
                            <p className={styles.statLabel}>Email: </p>
                            <Typography variant="body2" color="textSecondary" component="p">  {user.email}</Typography>
                        </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary" component="p">{user.profile_description}</Typography>
                </CardContent>
                <Divider light />
                <Box display={'flex'}>
                    <Box p={2} flex={'auto'} className={borderedGridStyles.item}>
                        <p className={styles.statLabel}>Rating: </p>
                        <Rating
                            name="read-only"
                            precision={0.01}
                            value={user.rating || 0}
                            readOnly
                            />
                    </Box>
                </Box>
                <Divider light/>
                <CardActions style={{justifyContent: 'center'}}>
                    <Button size="large" color="primary" onClick={logoutUser}>
                        Log out
                    </Button>
                </CardActions>
            </Card>
            <Card className={cx(styles.itemsCard, shadowStyles.root)}>
                <TabContext value={value}>
                    <AppBar position="static">
                        <TabList className={styles.tabList} onChange={handleChange} aria-label="simple tabs example">
                            <Tab label="Orders history" value="1" />
                            <Tab label="Your offers" value="2" />
                        </TabList>
                    </AppBar>
                    <TabPanel value="1"> <Order/> </TabPanel>
                    <TabPanel value="2"> <MyOffers/></TabPanel>
                </TabContext>
            </Card>
        </Box>
    );
}

export default ProfileCard