import React, {useEffect, useState} from 'react';
import {Card} from "react-bootstrap";
import api from "../api";
import {makeStyles} from "@material-ui/core/styles";
import cx from "clsx";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Rating from "@material-ui/lab/Rating";
import {useFadedShadowStyles} from '@mui-treasury/styles/shadow/faded';
import {useGutterBorderedGridStyles} from '@mui-treasury/styles/grid/gutterBordered';

const useStyles = makeStyles(({ palette }) => ({
    card: {
        margin: "auto",
        marginTop: 10,
        borderRadius: 12,
        width: 500,
        textAlign: 'center',
        overflow: 'auto',
        scrollbarWidth: "none" /* Firefox */,
        maxHeight: 500,
        "&::-webkit-scrollbar": {
            display: "none"
        }
    },
    avatar: {
        width: 120,
        height: 120,
        margin: 'auto',
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: '0.5px',
        marginTop: 8,
        marginBottom: 0,
    },
    statLabel: {
        fontSize: 12,
        color: palette.grey[500],
        fontWeight: 500,
        fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        margin: 0,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: '1px',
    },
}));

function OtherUserProfile(props) {

    const [user, setUser] = useState({});
    const {id} = props.match.params;

    const styles = useStyles();
    const shadowStyles = useFadedShadowStyles();
    const borderedGridStyles = useGutterBorderedGridStyles({
        borderColor: 'rgba(0, 0, 0, 0.08)',
        height: '50%',
    });

    useEffect(() => {
        getUserInfo();
    }, [])

    const getUserInfo = () => {
        api.getOtherUserProfile(id)
            .then((res) => {setUser(res.data);
            })
            .catch((err) => {
                console.log("Could not get user " + err.message);
            })
    }

    return (
            <Card className={cx(styles.card, shadowStyles.root)}>
                <CardContent>
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
                            name="simple-controlled"
                            value={3}
                        />
                    </Box>
                </Box>
                <Divider light/>
            </Card>
    );
}

export default OtherUserProfile;
