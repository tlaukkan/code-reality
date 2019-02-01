import {getClusterConfiguration, IdTokenIssuer} from "reality-space";
import config from 'config';

export async function getClusterConfig() {
    const clusterConfigurationUrl = config.get('Cluster.configurationUrl') as string;
    return await getClusterConfiguration(clusterConfigurationUrl);
}

export async function getIdTokenIssuers() : Promise<Array<IdTokenIssuer>> {
    return (await getClusterConfig()).idTokenIssuers;
}