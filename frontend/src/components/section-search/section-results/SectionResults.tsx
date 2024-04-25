import { Search } from "@/components/icons/Search"
import { CardResult } from "./card-result/CardResult"
import talleres from "./talleres.json"

type ResultProps = {
    city: string,
    item: string
}

export const SectionResults = ({ city, item }: ResultProps) => {

    const workshopsFound = talleres.filter((taller) => taller.ciudad.includes(city) && taller.rubro === item)

    return (
        <section className="pt-24 pb-36 flex flex-col items-center">
            {(city && item) ?
                < >
                    <h3 className="font-black  text-2xl sm:text-3xl text-center mb-8">Resultados de Búsqueda</h3>
                    {workshopsFound.length > 0
                        ?
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-5 gap-x-4 items-center">
                            {workshopsFound.map((taller, index) => (
                                <CardResult key={index} workshop={taller} />
                            ))}
                        </div>
                        :
                        <div className="flex flex-row gap-1 justify-center items-center">
                            <Search width={18} />
                            <p>No existen resultados</p>
                        </div>
                    }

                </>
                :
                <h3 className="font-medium  text-base text-center mb-8">Realiza una búsqueda para ver resultados</h3>
            }
        </section>
    )
}
