import React,{Component} from 'react';
import {} from '../services/api'



const AperaOnBoarding = (props)=>{



    useEffect(() => {
      const { route } = props;

      if(route.data.sucess){

      }
	}, [])

    return (
        <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerText}>
            Apera Onboarding
            </Text>
        </View>
        <View style={styles.body}>
            <Text style={styles.bodyText}>
            This is the Apera Onboarding screen
            </Text>
        </View>
        </View>
    );
}



export default AperaOnBoarding;