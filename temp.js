class IndecisionApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subtitle: 'Put your life in the hands of a computer',
      options: props.options
    }
    
    this.handleDeleteOption = this.handleDeleteOption.bind(this);
    this.handleDeleteOptions = this.handleDeleteOptions.bind(this);
    this.handleMakeDecision = this.handleMakeDecision.bind(this);
    this.handleAddOption = this.handleAddOption.bind(this);
  }

  componentDidMount() {
    try {
      this.setState({ options: JSON.parse(localStorage.getItem('options')) || [] });
    } catch(e) {
      console.log('Error:', e);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.options.length !== this.state.options.length) {
      localStorage.setItem('options', JSON.stringify(this.state.options));
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
  }

  handleDeleteOption(option) {
    this.setState(prevState => ({
      options: prevState.options.filter(item => item !== option)
    }));
  }

  handleDeleteOptions() {
    this.setState({options: []});
  }

  handleMakeDecision() {
    const randomNum = Math.floor(Math.random() * this.state.options.length);
    const option = this.state.options[randomNum];
    alert(option);
  }

  handleAddOption(option) {
    if (!option) {
      return 'Enter valid value to add item';
    } else if (this.state.options.indexOf(option) > -1) {
      return 'This option already exists';
    }

    this.setState({options: [...this.state.options, option]});

  }

  render() {
    return (
      <div>
        <Header subtitle={this.state.subtitle} />
        <Action hasOptions={this.state.options.length > 0} handleMakeDecision={this.handleMakeDecision} />
        <Options options={this.state.options} handleDeleteOptions={this.handleDeleteOptions} handleDeleteOption={this.handleDeleteOption} />
        <AddOption handleAddOption={this.handleAddOption}/>
      </div>
    );
  }
}

IndecisionApp.defaultProps = {
  options: []
};

const Header = (props) => (
  <div>
    <h1>{props.title}</h1>
    { props.subtitle && <h2>{props.subtitle}</h2>}
  </div>
);

Header.defaultProps = {
  title: 'Indecision'
};

const Action = (props) => (
  <div>
    <button onClick={props.handleMakeDecision} disabled={!props.hasOptions}>What should I do?</button>
  </div>
);

const Options = (props) => (
  <div>
    <button onClick={props.handleDeleteOptions}>remove all</button>
    {props.options.length === 0 && <p>Please add an option</p>}
    { props.options.map((option, index) => <Option key={index} value={option} handleDeleteOption={props.handleDeleteOption} />)}
  </div>
);

const Option = (props) => (
  <p>{props.value} <button onClick={() => props.handleDeleteOption(props.value)}>X</button></p>
);

class AddOption extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: undefined
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(e) {
    e.preventDefault();
    const option = e.target.elements.option.value.trim();
    const error = this.props.handleAddOption(option);
    this.setState({ error })

    if (!error) {
      e.target.elements.option.value = '';
    }
  }

  render() {
    return (
      <div>
        { this.state.error && <p>{ this.state.error }</p>}
        <form onSubmit={this.onFormSubmit}>
          <input type="text" name="option" />
          <button>Add Option</button>
        </form>
      </div>
    )
  }
}


ReactDOM.render(<IndecisionApp options={['mati', 'maru']}/>, document.getElementById('app'));