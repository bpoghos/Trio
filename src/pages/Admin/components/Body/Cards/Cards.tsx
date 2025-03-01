import { Spinner, Table, Form } from 'react-bootstrap';
import Card from './Card/Card';
import { useConcerts } from '../../../../../customHooks/customHooks';
import { useEffect, useState } from 'react';

const Cards = () => {
    const { data, loading, getDataFromFirestore } = useConcerts();
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState('');

    useEffect(() => {
        getDataFromFirestore();
    }, []);

    const filteredData = data.filter(concert => {
        const concertDate = concert.date instanceof Date
            ? concert.date.toISOString().split('T')[0]  
            : concert.date.toDate().toISOString().split('T')[0]; // Convert Firestore Timestamp

        return (
            (concert.city_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                concert.hall_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (yearFilter === '' || concertDate.startsWith(yearFilter)) // Check if year matches
        );
    });


    return (
        <>
           
                <Form.Control
                    type="text"
                    placeholder="Search by year"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    style={{ maxWidth: '300px' }}
                />
                <Form.Control
                    type="text"
                    placeholder="Search by city or hall name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '300px' }}
                />
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>City_Name</th>
                        <th>Hall_Name</th>
                        <th>Time</th>
                        <th>Image</th>
                        <th>Link</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {!filteredData.length ? (
                        <tr>
                            <td className="text-center">
                                No data
                            </td>
                        </tr>
                    ) : (
                        filteredData.map((concert) => (
                            <Card concert={concert} key={concert.id} data={data} />
                        ))
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={6} className="text-start">
                            <strong>Total Concerts: {filteredData.length}</strong>
                        </td>
                    </tr>
                </tfoot>
            </Table>
            {loading && (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" role="status" />
                </div>
            )}        </>
    );
}

export default Cards;
