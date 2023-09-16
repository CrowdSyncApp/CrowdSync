import React, { createContext, useContext } from 'react';
import { Logger,AWSCloudWatchProvider, Amplify } from 'aws-amplify';
import awsmobile from "./src/aws-exports";
import { TextEncoder, TextDecoder } from 'text-encoding';

if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

const LogContext = createContext();

export function useLog() {
    return useContext(LogContext);
}

export function LogProvider({ children }) {

    const log = new Logger('CrowdSync', 'DEBUG');
    Amplify.register(log);
    log.addPluggable(new AWSCloudWatchProvider({
        logGroupName: 'CrowdSync_Debug_Logs',
      logStreamName: 'CrowdSync_Log_Stream',
      region: awsmobile.aws_project_region,
    }))

    return <LogContext.Provider value={log}>{children}</LogContext.Provider>;
}
