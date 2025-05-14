"use client"

import { generatePath } from '@/lib/config';
import  { type FloorType } from '@/lib/types';
import useToast from '@/lib/useToast';
import  { useState } from 'react';


type CreateFloorType = {
    onCreate: (newFloor: FloorType) => void
    closeModal: () => void
}

const CreateFloor = ({ onCreate, closeModal }: CreateFloorType) => {
    const [floorNumber, setFloorNumber] = useState('');
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {showSuccess, showError}= useToast()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!floorNumber || !description) {
            showError('Tous les champs doivent être remplis.');
            return;
        }

        const nouveauFloor = {
            floorNumber,
            description,
        };
        setIsLoading(true);
        try {
            const response = await fetch(generatePath('/floors'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nouveauFloor),
            });

            if (response.ok) {
                const createdFloor = (await response.json()) as FloorType;
                onCreate(createdFloor); 
                setFloorNumber('');
                setDescription('');
                setErrorMessage('');
                showSuccess('L\'étage a été créé avec succès !');
            } else {
                console.error('Erreur lors de la création du floors');
                setErrorMessage('Erreur lors de la création du floors.');
                showError('Erreur lors de la création du floors.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données:', error);
            setErrorMessage('Erreur lors de l\'envoi des données.');
            showError('Erreur lors de l\'envoi des données.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
                <input
                    type="number"
                    placeholder="Numéro de l'étage"
                    value={floorNumber}
                    onChange={(e) => setFloorNumber(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0"
                />
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm
             focus:ring-blue-900 focus:border-blue-900 outline-0"
                />
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {isLoading && <p>Loading...</p>}
            <div className="flex justify-between mt-4">

                <button type="button" onClick={closeModal}
                    className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer">
                    Annuler
                </button>
                <button type="submit" 
                className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 cursor-pointer">
                    Créer
                </button>
            </div>
        </form>
    );
};

export default CreateFloor;
