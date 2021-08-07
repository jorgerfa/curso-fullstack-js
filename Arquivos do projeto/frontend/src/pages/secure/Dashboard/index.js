import React from 'react';
import Header from '../../../shared/header';
import { PageContent} from '../../../shared/styles';
import { Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class DashBoard extends React.Component {
    render() {
        return(
            <>
                <Header />
                <PageContent>
                    <Container>
                        <h2>Dashboard</h2>
                        <p>Aqui podemos listar os últimos envios, contatos adicionados ou estatísticas.</p>
                    </Container>
                </PageContent>
            </>
        )
    }
}

export default withRouter(DashBoard);