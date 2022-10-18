
import { useEffect } from 'react';
//Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'
import Alert from './components/layout/Alert';
import Backdrop from './components/layout/Backdrop';
import Linear from './components/layout/Linear';
import ContetntMain from './components/layout/ContentMain';

//Material-UI
import { makeStyles } from '@material-ui/core/styles';
//Firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";
//import firebaseApp from './util/firebaseApp';
//Redux
import { connect, ConnectedProps } from "react-redux";
import { isSignedInAC, anonymousUserAC } from './redux/actions/uiActions';
import { getConfig } from './redux/actions/uiActions';
import { RootState } from './redux/store';
import firebaseApp from './util/firebaseApp';

const auth = getAuth(firebaseApp);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  loading: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2)
  },
  main: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    minHeight: '100vh'
  }
}));

const mapStateToProps = (state: RootState) => {
  return {
    uid: state.UI.uid
  }
}

const mapDispatchToProps = {
  isSignedInAC,
  anonymousUserAC,
  getConfig
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
interface Props extends PropsFromRedux { }

const App = (props: Props) => {
  const classes = useStyles();

  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(auth, (user) => {
      if (!!user) {
        props.isSignedInAC(user);
      } else {
        props.anonymousUserAC()
      }
    });

    props.getConfig(); //

    return function cleanup() {
      unregisterAuthObserver()
    }
  }, [])

  if (!props.uid) {
    return <p className={classes.loading}> Загрузка...</p>
  }

  return (
    <div className={classes.root}>
      <Header />
      <Sidebar />
      <div className={classes.main}>
        <ContetntMain />
        <Footer />
      </div>
      <Alert />
      <Backdrop />
      <Linear />
    </div>
  )
}

export default connector(App)


