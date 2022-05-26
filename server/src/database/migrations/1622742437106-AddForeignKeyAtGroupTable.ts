import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AddForeignKeyAtGroupTable1622742437106 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('groups',new TableColumn(
            {
                name:'user_id',
                type:'uuid',
                isNullable: true,
            }
            ))

            await queryRunner.createForeignKey('groups', new TableForeignKey({
                name : 'groupsUser',        //groups by user
                columnNames: ['user_id'],
                referencedColumnNames : ['id'],
                referencedTableName : 'users',
                onDelete : 'SET NULL',
                onUpdate : 'CASCADE'
    
            }))
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.dropForeignKey('groups', 'groupsUser');

        await queryRunner.dropColumn('groups','user_id')

    
    }

}
