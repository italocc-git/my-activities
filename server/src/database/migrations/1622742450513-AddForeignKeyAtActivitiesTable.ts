import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AddForeignKeyAtActivitiesTable1622742450513 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    
        await queryRunner.addColumn('activities',new TableColumn(
            {
                name: 'group_id',
                type: 'uuid',
                isNullable: true,
                
            }
            ))

            await queryRunner.createForeignKey('activities' , new TableForeignKey({
                name : 'activitiesGroup',
                columnNames : ['group_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'groups',
                onDelete : 'CASCADE',
                onUpdate : 'CASCADE'
            }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropForeignKey('activities','activitiesGroup')
        await queryRunner.dropColumn('activities','group_id')

    }

}
