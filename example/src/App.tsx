import * as React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {
  benchmarkAsyncStorage,
  benchmarkLeveldb,
  BenchmarkResults,
  BenchmarkResultsView
} from "./benchmark";
import {leveldbExample, leveldbTestExceptionMessage} from "./example";

interface BenchmarkState {
  leveldb?: BenchmarkResults;
  leveldbExample?: boolean;
  leveldbTestException: string[];
  asyncStorage?: BenchmarkResults;
  error?: string;
}

export default class App extends React.Component<{}, BenchmarkState> {
  state: BenchmarkState = {leveldbTestException: []};

  componentDidMount() {
    try {
      this.setState({
        leveldb: benchmarkLeveldb(),
        leveldbExample: leveldbExample(),
        leveldbTestException: leveldbTestExceptionMessage(),
      });

      benchmarkAsyncStorage().then(res => this.setState({asyncStorage: res}));
    } catch (e) {
      console.error('Error running benchmark:', e);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Example validity: {this.state.leveldbExample == undefined ? '' : this.state.leveldbExample ? 'passed' : 'failed'}</Text>
        {this.state.leveldb && <BenchmarkResultsView title="LevelDB" {...this.state.leveldb} />}
        {this.state.leveldbTestException && this.state.leveldbTestException.map((msg, idx) =>
          <Text key={idx}>Test Exception: {msg}</Text>
        )}
        {this.state.asyncStorage && <BenchmarkResultsView title="AsyncStorage" {...this.state.asyncStorage} />}
        {this.state.error && <Text>ERROR RUNNING: {this.state.error}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
